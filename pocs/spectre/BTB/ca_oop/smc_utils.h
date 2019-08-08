inline __attribute__((always_inline)) void call_addr(size_t addr)
{
  asm volatile(
    "movq %0, %%rax\n\t"
    "call *%%rax"
    : 
    : "r" (addr)
    : "%rax"
    );
}

size_t inject_code(size_t dest, char* hex, size_t length)
{
  memcpy((void*)dest, hex, length);
  return dest + length;
}

size_t inject_jump(size_t dest, size_t target)
{
  char *code_base_jump = "\x48\xb8--ADDR--"
                         "\xff\xe0";
  size_t end = inject_code(dest, code_base_jump, strlen(code_base_jump));
  *((size_t*)(dest+2)) = target;
  return end;
}

size_t inject_maccess(size_t dest, size_t target)
{
  char *code_base_maccess = "\x48\xb9--ADDR--"
                            "\x8a\x01";
  size_t end = inject_code(dest, code_base_maccess, strlen(code_base_maccess));
  *((size_t*)(dest+2)) = target;
  return end;
}

size_t inject_nop(size_t dest, size_t no)
{
  while(no)
  {
    no--;
    dest = inject_code(dest, "\x90", 1);
  }
  return dest;
}

size_t assemble(char *in, char **out)
{
  FILE *asm_file = fopen("tmp.s", "w");
  if (asm_file == NULL)
    return 0;
  fwrite(in, strlen(in), 1, asm_file);
  fclose(asm_file);

  system("as -o tmp.elf tmp.s; objcopy -O binary tmp.elf tmp.bin");

  char *buffer = NULL;
  size_t length;
  FILE *bin_file = fopen("tmp.bin", "rb");

  if (bin_file)
  {
    fseek(bin_file, 0, SEEK_END);
    length = ftell(bin_file);
    fseek (bin_file, 0, SEEK_SET);
    buffer = malloc(length);
    if (buffer)
    {
      fread(buffer, 1, length, bin_file);
    }
    fclose(bin_file);
  }

  system("rm tmp.elf tmp.bin tmp.s");

  *out = buffer;

  return length;
}

size_t inject_asm(size_t dest, char* asm_code)
{
  char *hex = NULL;
  size_t length = assemble(asm_code, &hex);
  if (hex)
  {
    dest = inject_code(dest, hex, length);
    free(hex);
  }
  return dest;
}

#define VA_ARGS(...) , ##__VA_ARGS__
#define inject_f_asm(dest, asm_code, ...)                    \
({                                                           \
  size_t ret = dest;                                         \
  char *code = asm_code;                                     \
  size_t len = snprintf(NULL, 0, code VA_ARGS(__VA_ARGS__)); \
  char *f_asm_code = malloc(len);                            \
  if (f_asm_code)                                            \
  {                                                          \
    sprintf(f_asm_code, code VA_ARGS(__VA_ARGS__));          \
    ret = inject_asm(ret, f_asm_code);                       \
    free(f_asm_code);                                        \
  }                                                          \
  ret;                                                       \
})
