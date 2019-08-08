#include <linux/fs.h>
#include <linux/init.h>
#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/sched.h>
#include <linux/seq_file.h>
#include <linux/slab.h>
#include <linux/uaccess.h>

static unsigned long cr3_val = 0;

static struct mm_struct *get_mm(size_t pid) {
  struct task_struct *task;
  struct pid *vpid;

  /* Find mm */
  task = current;
  if(pid != 0) {
    vpid = find_vpid(pid);
    if(!vpid)
      return NULL;
    task = pid_task(vpid, PIDTYPE_PID);
    if(!task)
      return NULL;
  }
  if(task->mm) {
    return task->mm;
  } else {
    return task->active_mm;
  }
  return NULL;
}

unsigned long pid_to_cr3(size_t pid) {
  struct mm_struct *mm = get_mm(pid);
  void *cr3_virt;
  unsigned long cr3_phys;

  if(mm) {
    cr3_virt = (void *)mm->pgd;
    cr3_phys = virt_to_phys(cr3_virt);

    return cr3_phys;
  } else {
    printk(KERN_INFO "No process found");
    return 0;
  }
}

static int my_proc_show(struct seq_file *m, void *v) {
  seq_printf(m, "0x%zx\n", cr3_val);
  return 0;
}

static ssize_t my_proc_write(struct file *file, const char __user *buffer,
                             size_t count, loff_t *f_pos) {
  char tmp[32];
  if(copy_from_user(tmp, buffer, 32)) {
    return EFAULT;
  }
  cr3_val = pid_to_cr3(simple_strtol(tmp, NULL, 0));
  return count;
}

static int my_proc_open(struct inode *inode, struct file *file) {
  return single_open(file, my_proc_show, NULL);
}

static struct file_operations my_fops = {.owner = THIS_MODULE,
                                         .open = my_proc_open,
                                         .release = single_release,
                                         .read = seq_read,
                                         .llseek = seq_lseek,
                                         .write = my_proc_write};

static int __init hello_init(void) {
  struct proc_dir_entry *entry;
  entry = proc_create("cr3", 0777, NULL, &my_fops);
  if(!entry) {
    return -1;
  } else {
    printk(KERN_INFO "create proc file successfully\n");
  }
  return 0;
}

static void __exit hello_exit(void) {
  remove_proc_entry("cr3", NULL);
  printk(KERN_INFO "Goodbye world!\n");
}

module_init(hello_init);
module_exit(hello_exit);
MODULE_LICENSE("GPL");
