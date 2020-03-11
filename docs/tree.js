var color = {
    root: "#DDDDDD",
    group: "#BBBBFF",
    works: "#FF5722",
    fails: "#8BC34A",
    todo: "#FFA500"
}

var data = [{
        id: 1,
        title: "Transient cause",
        father: null,
        img: "transient-overview.svg",
        description: "We split the tree based on the cause for entering transient execution. If the cause is handling a fault or a microcode assist upon instruction retirement, we have a Meltdown-type attack. If the cause is a control or data flow prediction, we have a Spectre-type attack.",
        sources: [
            sources["Canella2018"],
            sources["Kocher2019"],
            sources["Lipp2018"]
        ],
        color: color.root
    },
    {
        id: 2,
        title: "Spectre-type",
        img: "spectre-root.svg",
        text_top: "prediction",
        description: "Spectre exploits a performance optimization in modern CPUs. Instead of waiting for the correct resolution of a branch, the CPU tries to predict the most likely outcome of the branch and starts transiently executing along the predicted path. Upon resolving the branch, the CPU discards the results of the transient execution if the prediction was wrong but does not revert changes in the microarchitecture. The prediction is based on events in the past, allowing an attacker to mistrain the predictor to leak data through the microarchitecture that should normally not be accessible to the attacker.",
        sources: [
            sources["Kocher2019"],
            sources["Canella2018"]
        ],
        father: 1,
        color: color.group
    },
    {
        id: 3,
        title: "Meltdown-type",
        img: "meltdown-root.svg",
        text_bottom: "fault/assist",
        father: 1,
        description: "Meltdown exploits the fact that exceptions are only raised (i.e., become architecturally visible) upon the retirement of the faulting instruction. In some microarchitectures, this property allows transient instructions ahead in the pipeline to compute on unauthorized results of the instruction that is about to suffer a fault. The CPU's in-order instruction-retirement mechanism takes care to discard any architectural effects of such computations, but secrets may leak through microarchitectural covert channels.<p/>We further classify Meltdown-type attacks based on the fault condition. A first category of <i>architectural faults</i> iterates over all possible Intel x86 exception types. A second category considers so-called <i>microarchitectural faults</i>, which are never visible at the architectural level, by branching on different conditions that provoke microcode assists.<p/>The resulting unambiguous naming scheme results in Meltdown-type attack leaves of the form “Meltdown-TC-BUF”, where TC denotes the transient cause (specific exception type or microcode assist) and BUF denotes the microarchitectural buffer responsible for the leakage.",
        sources: [
            sources["Lipp2018"],
            sources["VanBulck2018"],
            sources["VanSchaik2019"],
            sources["Canella2019"],
            sources["Schwarz2019"],
            sources["Canella2018"],
        ],
        color: color.group
    },
    {
        id: 4,
        title: "Spectre-PHT",
        alias: "Spectre v1",
        img: "spectre.svg",
        text_top: "microarchitectural buffer",
        father: 2,
        description: "Kocher et al. first introduced Spectre-PHT, an attack that poisons the Pattern History Table (PHT) to mispredict the direction (taken or not-taken) of conditional branches. Depending on the underlying microarchitecture, the PHT is accessed based on a combination of virtual address bits of the branch instruction plus a hidden Branch History Buffer (BHB) that accumulates global behavior for the last N branches on the same physical core.",
        sources: [
            sources["Canella2018"],
            sources["Kocher2019"],
            sources["Evtyushkin2018"],
            sources["Fog"]
        ],
        names: [
            {
                title: "Spectre variant 1",
                url: "https://spectreattack.com/"
            },
            {
                title: "Spectre variant 1.1",
                url: "https://arxiv.org/pdf/1807.03757.pdf"
            },
            {
                title: "Bounds Check Bypass (BCB)",
                url: "https://software.intel.com/security-software-guidance/api-app/sites/default/files/336983-Intel-Analysis-of-Speculative-Execution-Side-Channels-White-Paper.pdf"
            }
        ],
        cve: [{
            title: "CVE-2017-5753",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5753"
        }],
        poc: [{
                title: "https://github.com/IAIK/transientfail",
                url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT"
            },
            {
                title: "https://github.com/google/safeside",
                url: "https://github.com/google/safeside/tree/master/demos"
            }
        ],
        color: color.group
    },
    {
        id: 5,
        title: "Spectre-BTB",
        alias: "Spectre v2",
        img: "spectre.svg",
        father: 2,
        description: "In Spectre-BTB, the attacker poisons the Branch Target Buffer (BTB) to steer the transient execution to a mispredicted branch target. For direct branches, the CPU indexes the BTB using a subset of the virtual address bits of the branch instruction to yield the predicted jump target. For indirect branches, CPUs use different mechanisms, which may take into account global branching history accumulated in the BHB when indexing the BTB. We refer to both types as Spectre-BTB.<p>Contrary to Spectre-PHT, where transient instructions execute along a restricted mispredicted path, Spectre-BTB enables redirection of transient control flow to an arbitrary destination. Adopting established techniques from return-oriented programming (ROP) attacks, but abusing BTB poisoning instead of application-level vulnerabilities, selected code “gadgets” found in the victim address space may be chained together to construct arbitrary transient instruction sequences. Hence, while the success of Spectre-PHT critically relies on unintended leakage along the mispredicted code path, ROP-style gadget abuse in Spectre-BTB enables more direct construction of covert channels that expose secrets from the transient domain.",
        sources: [
            sources["Kocher2019"],
            sources["Canella2018"]
        ],
        names: [
            {
                title: "Spectre variant 2",
                url: "https://spectreattack.com/"
            },
            {
                title: "Branch Target Injection (BTI)",
                url: "https://software.intel.com/security-software-guidance/api-app/sites/default/files/336983-Intel-Analysis-of-Speculative-Execution-Side-Channels-White-Paper.pdf"
            }

        ],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        poc: [{
                title: "https://github.com/IAIK/transientfail",
                url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB"
            },
            {
                title: "https://github.com/google/safeside",
                url: "https://github.com/google/safeside/tree/master/demos"
            }
        ],
        color: color.group
    },
    {
        id: 6,
        title: "Spectre-RSB",
        alias: "ret2spec",
        img: "spectre.svg",
        father: 2,
        description: "Maisuradze and Rossow and Koruyeh et al. introduced a Spectre variant that exploits the Return Stack Buffer (RSB). The RSB is a small per-core microarchitectural buffer that stores the virtual addresses following the N most recent <code>call</code> instructions. When encountering a <code>ret</code> instruction, the CPU pops the topmost element from the RSB to predict the return flow.<p>Misspeculation arises whenever the RSB layout diverges from the actual return addresses on the software stack. Such disparity for instance naturally occurs when restoring kernel/enclave/user stack pointers upon protection domain switches.<p>Furthermore, same-address-space adversaries may explicitly overwrite return addresses on the software stack, or transiently execute <code>call</code> instructions which update the RSB without committing architectural effects. This may allow untrusted code executing in a sandbox to transiently divert return control flow to interesting code gadgets outside of the sandboxed environment.<p>Due to the fixed-size nature of the RSB, a special case of misspeculation occurs for deeply nested function calls. Since the RSB can only store return addresses for the N most recent calls, an underfill occurs when the software stack is unrolled. In this case, the RSB can no longer provide accurate predictions. Starting from Skylake, Intel CPUs use the BTB as a fallback, thus allowing Spectre-BTB-style attacks triggered by <code>ret</code> instructions.",
        sources: [
            sources["Maisuradze2018"],
            sources["Koruyeh2018"],
            sources["Canella2018"]
        ],
        names: [
            {
                title: "ret2spec",
                url: "https://arxiv.org/pdf/1807.10364.pdf",
            },
            {
                title: "SpectreRSB",
                url: "https://www.usenix.org/conference/woot18/presentation/koruyeh",
            },
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB"
        }],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        color: color.group
    },
    {
        id: 7,
        title: "Spectre-STL",
        alias: "Spectre v4",
        img: "spectre.svg",
        father: 2,
        description: "Speculation in modern CPUs is not restricted to control flow but also includes predicting dependencies in the data flow. A common type, a Store To Load (STL) dependency, requires that a memory load shall not be executed before all preceding stores writing to the same location have completed. However, even before the addresses of all prior stores in the pipeline are known, the CPU's memory disambiguator may predict which loads can already be executed speculatively. <p>When the disambiguator predicts that a load does not have a dependency on a prior store, the load reads data from the L1 data cache. When the addresses of all prior stores are known, the prediction is verified. If any overlap is found, the load and all following instructions are re-executed. </p><p>Jann Horn (Google Project Zero) showed how mispredictions by the memory disambiguator could be abused to speculatively bypass store instructions. Like previous attacks, Spectre-STL adversaries rely on an appropriate transient instruction sequence to leak unsanitized stale values via a microarchitectural covert channel. Furthermore, operating on stale pointer values may speculatively break type and memory safety guarantees in the transient execution domain. </p>",
        sources: [
            sources["Horn2018"],
            sources["Canella2018"]
        ],
        poc: [{
                title: "https://github.com/IAIK/transientfail",
                url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/STL"
            },
            {
                title: "https://github.com/google/safeside",
                url: "https://github.com/google/safeside/tree/master/demos"
            }
        ],
        names: [
            {
                title: "Spectre variant 4",
                url: "https://software.intel.com/security-software-guidance/software-guidance/speculative-store-bypass"
            },
            {
                title: "Speculative Store Bypass (SSB)",
                url: "https://software.intel.com/security-software-guidance/software-guidance/speculative-store-bypass"
            },
        ],
        cve: [{
            title: "CVE-2018-3639",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-3639"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/speculative-store-bypass"
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            },
        ],
        color: color.works
    },
    {
        id: 8,
        title: "Meltdown-NM-REG",
        alias: "LazyFP",
        father: 3,
        description: "During a context switch, the OS has to save all the registers, including the floating point unit (FPU) and SIMD registers. These latter registers are large and saving them would slow down context switches. Therefore, CPUs allow for a lazy state switch, meaning that instead of saving the registers, the FPU is simply marked as “not available”. The first FPU instruction issued after the FPU was marked as “not available” causes a  device-not-available (#NM) exception, allowing the OS to save the FPU state of previous execution context before marking the FPU as available again. <p/> Stecklina and Prescher propose an attack on the above lazy state switch mechanism. The attack consists of three steps. In the first step, a victim performs operations loading data into the FPU registers. Then, in the second step, the CPUswitches to the attacker and marks the FPU as “not available”. The attacker now issues an instruction that uses the FPU, which generates an #NM fault. Before the faulting instruction retires, however, the CPU has already transiently executed the following instructions using data from the previous context. As such, analogous to previous Meltdown-type attacks, a malicious transient instruction sequence following the faulting instruction can encode the unauthorized FPU register contents through a microarchitectural covert channel.",
        sources: [
            sources["Stecklina2018"],
            sources["Canella2018"]
        ],
        names: [
            {
                title: "Lazy FP State Restore (LazyFP)",
                url: "https://www.cyberus-technology.de/posts/2018-06-06-intel-lazyfp-vulnerability.html"
            },
        ], 
        cve: [{
            title: "CVE-2018-3665",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-3665"
        }],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/NM"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://www.intel.com/content/www/us/en/security-center/advisory/intel-sa-00145.html"
            },
        ],
        color: color.works
    },
    {
        id: 9,
        title: "Meltdown-AC",
        alias: "",
        father: 3,
        description: "Upon detecting an unaligned memory operand, the CPU may generate an alignment-check exception (#AC) when the EFLAGS.AC flag is set. In our tests on Intel CPUs, we were unable to transiently encode the results of unaligned memory accesses. We suspect that this is because #AC is generated early in the pipeline, even before the operand’s virtual address is translated to a physical one. However, this appears not to be the case on some AMD and ARM microarchitectures, on which it is possible to transiently leak data after the exception.",
        sources: [
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/AC"
        }],
        affects: [
            {
                title: "AMD",
                url: "https://www.amd.com/system/files/documents/security-whitepaper.pdf"
            },
            {
                title: "ARM",
            },
        ],
        color: color.group
    },
    {
        id: 67,
        title: "Meltdown-AC-LFB",
        alias: "RIDL",
        img: "mds.svg",
        father: 9,
        description: "The RIDL addendum explained that misaligned loads due to the AC flag may leak data from line-fill buffers. Interestingly, in contrast to the main RIDL variant Meltdown-P-LFB exploiting page faults, Meltdown-AC-LFB may work even on processors enumerating RDCL_NO silicon mitigations.",
        sources: [
            sources["RIDLAddendum1"],
            sources["VanSchaik2019"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "Rogue In-flight Data Load (RIDL) Addendum",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Fill Buffer Data Sampling (MFBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12130",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12130"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        poc: [{
            title: "https://github.com/vusec/ridl",
            url: "https://github.com/vusec/ridl",
        }],
        color: color.works
    },
    {
        id: 68,
        title: "Meltdown-AC-LP",
        alias: "RIDL",
        img: "mds.svg",
        father: 9,
        description: "The RIDL addendum explained that misaligned loads due to the AC flag may leak data from load ports. Interestingly, in contrast to the main RIDL variant Meltdown-P-LFB exploiting page faults, Meltdown-AC-LP may work even on processors enumerating RDCL_NO silicon mitigations.",
        sources: [
            sources["RIDLAddendum1"],
            sources["VanSchaik2019"],
            sources["Falk2019"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "Rogue In-flight Data Load (RIDL) Addendum",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Load Port Data Sampling (MLPDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12127",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12127"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        poc: [{
            title: "https://github.com/vusec/ridl",
            url: "https://github.com/vusec/ridl",
        }],
        color: color.works
    },
    {
        id: 10,
        title: "Meltdown-DE",
        father: 3,
        description: "On the ARM microarchitectures we tested, division by zero produces no exception, merely yielding zero. As there is no fault, we do not count this as a Meltdown variant on ARM. On x86, the division raises a divide-by-zero exception (#DE). On both the AMD and Intel microarchitectures we tested, the CPU continues with transient execution after the exception, using zero as the result of the division. Thus the division itself does not leak a value (for example the numerator) but subsequent transient execution can still be used to leak values.", 
        sources: [
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/DE"
        }],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
        ],
        color: color.works
    },
    {
        id: 11,
        title: "Meltdown-PF",
        img: "pte.svg",
        father: 3,
        description: "The category of Meltdown attacks caused by a page fault. As there are many possibilities for a page fault, the attacks are further classified by the bit in the page-table entry causing the page fault.",
        sources: [
            sources["Canella2018"]
        ],
        color: color.group
    },
    {
        id: 12,
        title: "Meltdown-UD",
        father: 3,
        description: "For our original paper we did not succeed in transiently executing instructions following an invalid opcode. Google's Safeside project subsequently achieved this on ARM, and we have updated our PoC accordingly. We suspect that on Intel and AMD CPUs exceptions during instruction fetch or decode are immediately handled by the CPU, without first buffering the offending instruction in the ROB. Hence, invalid opcodes would only leak if the microarchitectural effect is an effect caused by the invalid opcode itself, rather than by subsequent transient instructions.",
        sources: [
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/UD"
        },
        {
            title: "https://github.com/google/safeside",
            url: "https://github.com/google/safeside/blob/master/demos/meltdown_ud.cc"
        }],
        affects: [{
            title: "ARM",
        }],
        color: color.works
    },
    {
        id: 13,
        title: "Meltdown-SS",
        father: 3,
        description: "We reliably found in our experiments on Intel CPUs that we cannot transiently leak the results of out-of-limit segment accesses. We suspect that, due to the simplistic IA32 segmentation design, segment limits are validated early-on, and immediately raise a #GP or #SS (stack-segment fault) exception, without sending the offending instruction to the ROB. However, we have successfully reproduced Meltdown-SS on some AMD microarchitectures, which is consistent with AMD's documentation that #SS does not suppress speculation.",
        sources: [
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/SS"
        }],
        affects: [
            {
                title: "AMD",
                url: "https://www.amd.com/system/files/documents/security-whitepaper.pdf"
            }
        ],
        color: color.works
    },
    {
        id: 14,
        title: "Meltdown-BR",
        father: 3,
        description: "A Meltdown-BR attack exploits transient execution following a #BR exception to encode out-of-bounds secrets that are never architecturally visible. As such, Meltdown-BR is an exception-driven alternative for Spectre-PHT. Using such an attack, an attcker can leak data safeguarded by either an IA32 bound instruction (Intel, AMD), or state-of-the-art MPX protection (Intel-only). This is the first experiment demonstrating a Meltdown-type transient execution attack exploiting delayed exception handling on AMD CPUs.",
        sources: [
            sources["Intel2018"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/BR"
        }],
        color: color.group
    },
    {
        id: 15,
        title: "Meltdown-GP",
        father: 3,
        description: "Similar to page faults, x86 general protection faults (#GP) have been abused in multiple Meltdown-type attacks. We hence categorize further based on #GP cause and targeted microarchitectural buffer.",
        todo: "While we have done our best to explore all potentially exploitable causes for #GP exceptions in the x86 architecture, we encourage future research to further investigate potential Meltdown-GP variants.",
        sources: [
            sources["Canella2018"],
            sources["ARM2018"],
            sources["Intel2018"],
            sources["Canella2019"]
        ],
        color: color.group
    },
    {
        id: 16,
        title: "Meltdown-US",
        img: "pte-us.svg",
        father: 11,
        description: "Modern CPUs commonly feature a “user/supervisor” (U/S) pagetable attribute to denote a virtual memory page as belonging to the OS kernel. Page faults raised by the U/S attribute can be abused to read cached kernel secrets, as well as to extract data from other microarchitectural buffers. We therefore categorize Meltdown-US further by the leakage source.",
        sources: [
            sources["Lipp2018"],
            sources["Schwarz2019"],
            sources["Canella2019"],
            sources["Canella2018"]
        ],
        color: color.group
    },
    {
        id: 17,
        title: "Meltdown-P",
        img: "pte-p.svg",
        father: 11,
        description: "Meltdown-P exploits transient execution following a page fault when accessing unmapped pages (present bit clear). As with the U/S attribute, page faults caused by the present bit have been abused to extract data from a variety of buffers. We therefore categorize Meltdown-P further by the leakage source.",
        sources: [
            sources["VanBulck2018"],
            sources["VanSchaik2019"],
            sources["Canella2019"],
            sources["Canella2018"]
        ],
        color: color.group
    },
    {
        id: 18,
        title: "Meltdown-RW",
        img: "pte-rw.svg",
        alias: "v1.2",
        father: 11,
        description: "Kiriansky and Waldspurger presented the first Meltdown-type attack that bypasses page-table based access rights within the current privilege level. Specifically, they showed that transient execution does not respect the “read/write” page-table attribute. The ability to transiently overwrite read-only data within the current privilege level can bypass software-based sandboxes which rely on hardware enforcement of read-only memory.",
        sources: [
            sources["Kiriansky2018"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/RW"
        }],
        names: [
            {
                title: "Variant 1.2",
                url: "https://arxiv.org/pdf/1807.03757.pdf"
            },

        ],
        affects: [
            {
                title: "Intel",
                url: "https://www.intel.com/content/www/us/en/support/articles/000029382/processors.html"
            },
            {
                title: "ARM",
            }
        ],
        color: color.works
    },
    {
        id: 19,
        title: "Meltdown-PK",
        img: "pte-pk.svg",
        father: 11,
        description: "Intel Skylake-SP server CPUs support memory-protection keys for user space (PKU). This feature allows processes to change the access permissions of a page directly from user space, i.e., without requiring a syscall/hypercall. Thus, with PKU, user-space applications can implement efficient hardware-enforced isolation of trusted parts. A Meltdown-PK attack bypasses both the read and write isolation provided by the PKU. Meltdown-PK works if an attacker has code execution in the containing process, even if the attacker cannot execute the <code>wrpkru</code> instruction (e.g., blacklisting).",
        todo: "We encourage exploring the possibility of using Meltdown-PK to leak data from other buffers apart from the L1 cache and store buffer.",
        sources: [
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/insights/more-information-transient-execution-findings",
            },
        ],
        color: color.group
    },
    {
        id: 70,
        title: "Meltdown-PK-L1",
        father: 19,
        description: "As part of our systematic analysis, we presented a novel Meltdown-PK-L1 variant which bypasses both the read and write isolation provided by PKU to leak unauthorized data from the L1 cache.",
        sources: [
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/PK"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/insights/more-information-transient-execution-findings",
            },
        ],
        color: color.works
    },
    {
        id: 71,
        title: "Meltdown-PK-SB",
        alias: "Fallout",
        img: "mds.svg",
        father: 19,
        description: "The Fallout paper includes an experiment to leak data from the store buffer using a faulting load from a page marked as unreadable with PKU.",
        sources: [
            sources["Canella2019"]
        ],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/insights/more-information-transient-execution-findings",
            },
        ],
        names: [
            {
                title: "Fallout",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Store Buffer Data Sampling (MSBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12126",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12126"
        }],
        color: color.works
    },
    {
        id: 20,
        title: "Meltdown-XD",
        img: "pte-x.svg",
        father: 11,
        description: "On our test systems, we did not succeed in transiently executing instructions residing in non-executable memory.",
        sources: [
            sources["Canella2018"]
        ],
        color: color.fails
    },
    {
        id: 21,
        title: "Meltdown-SM-SB",
        alias: "Fallout",
        img: "mds.svg",
        father: 11,
        description: "Although supervisor mode access prevention (SMAP) raises a page fault (#PF) when accessing user-space memory from the kernel, it seems to be free of any Meltdown effect in our experiments. Thus, we were not able to leak user data from kernel space using Meltdown-SM in our experiments.<p/>However, the Fallout paper includes an experiment to leak store buffer data using SMAP exceptions from kernel space.",
        sources: [
            sources["Canella2018"],
            sources["Canella2019"]
        ],
        names: [
            {
                title: "Fallout",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Store Buffer Data Sampling (MSBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12126",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12126"
        }],
        affects: [
            {
                title: "Intel"
            }
        ],
        color: color.works
    },
    {
        id: 22,
        title: "Meltdown-MPX",
        father: 14,
        description: "An attacker can leak data safeguarded by state-of-the-art MPX protection (Intel-only).",
        sources: [
            sources["Intel2018"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/BR"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/insights/more-information-transient-execution-findings",
            },
        ],
        color: color.works
    },
    {
        id: 23,
        title: "Meltdown-BND",
        father: 14,
        description: "An attcker can leak data safeguarded by an IA32 bound instruction (Intel, AMD). This is the first experiment demonstrating a Meltdown-type transient execution attack exploiting delayed exception handling on AMD CPUs.",
        sources: [
            sources["Intel2018"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/BR"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/insights/more-information-transient-execution-findings",
            },
            {
                title: "AMD"
            }
        ],
        color: color.works
    },
    {
        id: 24,
        title: "Cross-address-space",
        text_top: "mistraining strategy",
        description: "In a cross-address-space scenario, an attacker has two options. In the first, an attacker can mirror the virtual address space layout of the victim on a hyperthread (same physical core) and mistrain at the exact same virtual address as the victim branch. We refer to this as cross-address-space in-place (CA-IP). In the second, the attacker mistrains the PHT on a congruent virtual address in a different address space. We refer to this as cross-address-space out-of-place (CA-OP). Cross-address-space attacks are possible because the PHT is shared between hyperthreads on the same logical core.",
        sources: [
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT"
        }],
        father: 4,
        color: color.group
    },
    {
        id: 25,
        title: "Same-address-space",
        father: 4,
        description: "In a same-address-space scenario, an attacker has two options. The first option is to mistrain the exact location that is later on attacked. We refer to this as same-address-space in-place (SA-IP), In the second scenario, a congruent address is used for the mistraining. This is possible because only a subset of the virtual address is used for indexing the PHT. We refer to this as same-address-space out-of-place (SA-OP).",
        sources: [
            sources["Kocher2019"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT"
        }],
        color: color.group
    },
    {
        id: 26,
        title: "Cross-address-space",
        father: 5,
        description: "In a cross-address-space scenario, an attacker has two options. In the first, an attacker can mirror the virtual address space layout of the victim on a hyperthread (same physical core) and mistrain at the exact same virtual address as the victim branch. We refer to this as cross-address-space in-place (CA-IP). In the second, the attacker mistrains the BTB on a congruent virtual address in a different address space. We refer to this as cross-address-space out-of-place (CA-OP). Cross-address-space attacks are possible because the BTB is shared between hyperthreads on the same logical core.",
        sources: [
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB"
        }],
        color: color.group
    },
    {
        id: 27,
        title: "Same-address-space",
        father: 5,
        description: "In a same-address-space scenario, an attacker has two options. The first option is to mistrain the exact location that is later on attacked. We refer to this as same-address-space in-place (SA-IP), In the second scenario, a congruent address is used for the mistraining. This is possible because only a subset of the virtual address is used for indexing the BTB. We refer to this as same-address-space out-of-place (SA-OP).",
        sources: [
            sources["Kocher2019"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB"
        }],
        color: color.group
    },
    {
        id: 28,
        title: "Cross-address-space",
        father: 6,
        description: "In a cross-address-space RSB attack, an attacker cannot simply run on a hyperthread to influence the RSB. This is because the RSB is not shared between hyperthreads. Therefore, an attacker has to interleave the execution of their program with the victim's program to poison the RSB. This is possible in both in-place and out-of-place scenarios.",
        sources: [
            sources["Maisuradze2018"],
            sources["Koruyeh2018"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB"
        }],
        color: color.group
    },
    {
        id: 29,
        title: "Same-address-space",
        father: 6,
        description: "In a same-address-space RSB attack, an attacker can explicitly overwrite the return address on the software stack or transiently execute <code>call</code> instructions. Another cause for misspeculation is deeply nested function calls. This is due to the limited size of the RSB. One natural occurrence of RSB misspeculation is when restoring the kernel/enclave/user stack pointer upon switching protection domains. In all those cases, the execution might be diverted to a special code gadget that leaks data.",
        sources: [
            sources["Maisuradze2018"],
            sources["Koruyeh2018"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB"
        }],
        color: color.group
    },
    {
        id: 30,
        title: "PHT-CA-IP",
        img: "spectre.svg",
        text_top: "in-place (IP) vs. out-of-place (OP)",
        father: 24,
        description: "The cross-address-space, in-place variant of Spectre-PHT.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT/ca_ip"
        }],
        sources: [
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        cve: [{
            title: "CVE-2017-5753",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5753"
        }],
        color: color.works
    },
    {
        id: 31,
        title: "PHT-CA-OP",
        img: "spectre.svg",
        father: 24,
        description: "The cross-address-space, out-of-place variant of Spectre-PHT.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT/ca_oop"
        }],
        sources: [
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        cve: [{
            title: "CVE-2017-5753",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5753"
        }],
        color: color.works
    },
    {
        id: 32,
        title: "PHT-SA-IP",
        alias: "Spectre v1",
        img: "spectre.svg",
        father: 25,
        description: "The same-address-space, in-place variant of Spectre-PHT. This was one of the first discovered variants. It is the best-known variant of Spectre-PHT.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT/sa_ip"
        }],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        sources: [
            sources["Kocher2019"],
            sources["Kiriansky2018"],
            sources["Canella2018"]
        ],
        cve: [{
            title: "CVE-2017-5753",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5753"
        }],
        color: color.works
    },
    {
        id: 33,
        title: "PHT-SA-OP",
        img: "spectre.svg",
        father: 25,
        description: "The same-address-space, out-of-place variant of Spectre-PHT.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT/sa_oop"
        }],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        sources: [
            sources["Canella2018"]
        ],
        cve: [{
            title: "CVE-2017-5753",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5753"
        }],
        color: color.works
    },
    {
        id: 34,
        title: "BTB-CA-IP",
        alias: "Spectre v2",
        img: "spectre.svg",
        father: 26,
        description: "The cross-address-space, in-place variant of Spectre-BTB. This was one of the first discovered variants.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB/ca_ip"
        }],
        sources: [
            sources["Kocher2019"],
            sources["Chen2019"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        color: color.works
    },
    {
        id: 35,
        title: "BTB-CA-OP",
        alias: "Spectre v2",
        img: "spectre.svg",
        father: 26,
        description: "The cross-address-space, out-of-place variant of Spectre-BTB. This was one of the first discovered variants.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB/ca_oop"
        }],
        sources: [
            sources["Kocher2019"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
        ],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        color: color.works
    },
    {
        id: 36,
        title: "BTB-SA-IP",
        img: "spectre.svg",
        father: 27,
        description: "The same-address-space, in-place variant of Spectre-BTB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB/sa_ip"
        }],
        sources: [
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        color: color.works
    },
    {
        id: 37,
        title: "BTB-SA-OP",
        alias: "Spectre v2",
        img: "spectre.svg",
        father: 27,
        description: "The same-address-space, out-of-place variant of Spectre-BTB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB/sa_oop"
        }],
        sources: [
            sources["Chen2019"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
        ],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        color: color.works
    },
    {
        id: 38,
        title: "RSB-CA-IP",
        alias: "ret2spec",
        img: "spectre.svg",
        father: 28,
        description: "The cross-address-space, in-place variant of Spectre-RSB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB/ca_ip"
        }],
        sources: [
            sources["Koruyeh2018"],
            sources["Maisuradze2018"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
        ],
        color: color.works
    },
    {
        id: 39,
        title: "RSB-CA-OP",
        img: "spectre.svg",
        father: 28,
        description: "The cross-address-space, out-of-place variant of Spectre-RSB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB/ca_oop"
        }],
        sources: [
            sources["Koruyeh2018"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
        ],
        color: color.works
    },
    {
        id: 40,
        title: "RSB-SA-IP",
        alias: "ret2spec",
        img: "spectre.svg",
        father: 29,
        description: "The same-address-space, in-place variant of Spectre-RSB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB/sa_ip"
        }],
        sources: [
            sources["Maisuradze2018"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            },
        ],
        color: color.works
    },
    {
        id: 41,
        title: "RSB-SA-OP",
        alias: "ret2spec",
        img: "spectre.svg",
        father: 29,
        description: "The same-address-space, out-of-place variant of Spectre-RSB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB/sa_oop"
        }],
        sources: [
            sources["Koruyeh2018"],
            sources["Maisuradze2018"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            },        ],
        color: color.works
    },
    {
        id: 42,
        title: "Meltdown-US-L1",
        alias: "Meltdown",
        img: "meltdown.svg",
        father: 16,
        description: "The original Meltdown attack reads cached kernel memory from user space on CPUs that do not transiently enforce the user/supervisor flag. In the trigger phase an unauthorized kernel address is dereferenced, which eventually causes a page fault. Before the fault becomes architecturally visible, however, the attacker executes a transient instruction sequence that for instance accesses a cache line based on the privileged data read by the trigger instruction. In the final phase, after the exception has been raised, the privileged data is reconstructed at the receiving end of the covert channel (e.g., Flush+Reload).",
        sources: [
            sources["Lipp2018"],
            sources["Canella2018"]
        ],
        poc: [{
                title: "https://github.com/IAIK/meltdown",
                url: "https://github.com/IAIK/meltdown"
            },
            {
                title: "https://github.com/IAIK/transientfail",
                url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/US"
            },
            {
                title: "https://github.com/google/safeside",
                url: "https://github.com/google/safeside/tree/master/demos"
            }
        ],
        names: [
            {
                title: "Meltdown",
                url: "https://meltdownattack.com/"
            },
            {
                title: "Rogue Data Cache Load (RDCL)",
                url: "https://software.intel.com/security-software-guidance/software-guidance/rogue-data-cache-load"
            },
            {
                title: "Variant 3",
            },
        ],
        cve: [{
            title: "CVE-2017-5754",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5754"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/rogue-data-cache-load"
            },
            {
                title: "ARM",
                url: "https://developer.arm.com/support/arm-security-updates/speculative-processor-vulnerability"
            },
            {
                title: "IBM",
                url: "https://www.ibm.com/blogs/psirt/potential-impact-processors-power-family/"
            },
        ],
        color: color.works
    },
    {
        id: 43,
        title: "Meltdown-US-LFB",
        alias: "ZombieLoad v1",
        img: "zombieload.svg",
        father: 16,
        description: "ZombieLoad uses various architectural and microarchitectural faults to leak data from the fill buffers. In contrast to Meltdown-US-L1, only the least-significant 6 bits of the virtual address can be used to address the data, thus giving less control over which data is leaked. However, this allows ZombieLoad to cross all privilege boundaries (user-to-user, kernel, Intel SGX, VM-to-VM, VM-to-hypervisor).",
        sources: [
            sources["Schwarz2019"],
            sources["VanSchaik2019"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "ZombieLoad",
                url: "https://zombieloadattack.com/"
            },
            {
                title: "Microarchitectural Fill Buffer Data Sampling (MFBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        poc: [{
            title: "https://github.com/IAIK/ZombieLoad",
            url: "https://github.com/IAIK/ZombieLoad/tree/master/attacker/variant1_linux"
        }],
        cve: [{
            title: "CVE-2018-12130",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12130"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        color: color.works
    },
    {
        id: 44,
        title: "Meltdown-US-SB",
        alias: "Fallout",
        img: "mds.svg",
        father: 16,
        description: "Fallout exploits the fact that faulting loads can pick up previously stored values from the store buffer if the least-significant 12 bits of the virtual address match.",
        sources: [
            sources["Canella2019"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "Fallout",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Store Buffer Data Sampling (MSBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ], 
        cve: [{
            title: "CVE-2018-12126",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12126"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        color: color.works
    },
    {
        id: 45,
        title: "Meltdown-US-LP",
        father: 16,
        description: "Intel explains that faulting loads which span a 64-byte cacheline boundary may leak data from the processor's load ports.",
        todo: "We encourage experimentation to confirm the possibility of reading CPU load port data through U/S exceptions.",
        sources: [
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "Microarchitectural Load Port Data Sampling (MLPDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12127",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12127"
        }],
        color: color.todo
    },
    {
        id: 46,
        title: "Meltdown-P-L1",
        alias: "Foreshadow",
        img: "foreshadow.svg",
        father: 17,
        description: "Meltdown-P-L1 exploits an “L1 Terminal Fault” (L1TF) microarchitectural condition when accessing unmapped pages. A terminal page fault occurs when accessing a page-table entry with either the “present” bit cleared or a “reserved” bit set. In such cases, the CPU immediately aborts address translation. However, since the L1 data cache is indexed in parallel to address translation, the page table entry’s physical address field (i.e., frame number) may still be passed to the L1 cache. Any data present in L1 and tagged with that physical address will now be forwarded to the transient execution, regardless of access permissions.</p>Foreshadow was initially demonstrated against Intel SGX technology, and a generalized form of the attack allows an attacker to bypass operating system or hypervisor isolation. This variation allows an untrusted virtual machine, controlling guest-physical addresses, to extract the host machine’s entire L1 data cache (including data belonging to the hypervisor or other virtual machines). The underlying problem is that a terminal fault in the guest page-tables early-outs the address translation process, such that guest-physical addresses are erroneously passed to the L1 data cache, without first being translated into a proper host physical address.</p>",
        sources: [
            sources["VanBulck2018"],
            sources["Weisse2018"],
            sources["Canella2018"]
        ],
        poc: [{
                title: "https://github.com/IAIK/transientfail",
                url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/P"
            },
            {
                title: "https://github.com/jovanbulck/sgx-step/",
                url: "https://github.com/jovanbulck/sgx-step/tree/master/app/foreshadow"
            }
        ],
        names: [
            {
                title: "Foreshadow, Foreshadow-NG",
                url: "https://foreshadowattack.eu/"
            },
            {
                title: "L1 Terminal Fault (L1TF)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-l1-terminal-fault",
            }
        ],
        cve: [{
                title: "CVE-2018-3615",
                url: "https://nvd.nist.gov/vuln/detail/CVE-2018-3615"
            },
            {
                title: "CVE-2018-3620",
                url: "https://nvd.nist.gov/vuln/detail/CVE-2018-3620"
            },
            {
                title: "CVE-2018-3646",
                url: "https://nvd.nist.gov/vuln/detail/CVE-2018-3646"
            }
        ],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/l1-terminal-fault"
            },
            {
                title: "IBM",
                url: "https://www.ibm.com/blogs/psirt/potential-impact-processors-power-family/"
            },
        ],
        color: color.works
    },
    {
        id: 47,
        title: "Meltdown-P-LFB",
        alias: "RIDL",
        img: "mds.svg",
        father: 17,
        description: "RIDL leaks in-flight data from the line-fill buffer (LFB) by exploiting faulting loads on non-present addresses. If the least-significant 6 bits of the non-present virtual address match a virtual address of data currently stored in the LFB, then this data can be leaked. Any data travelling between the L1 cache and the remaining memory subsystem has to go through the LFB and can be leaked with RIDL.",
        sources: [
            sources["VanSchaik2019"],
            sources["Schwarz2019"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "Rogue In-flight Data Load (RIDL)",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Fill Buffer Data Sampling (MFBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12130",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12130"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        poc: [{
            title: "https://github.com/vusec/ridl",
            url: "https://github.com/vusec/ridl",
        }],
        color: color.works
    },
    {
        id: 48,
        title: "Meltdown-P-SB",
        alias: "Fallout",
        img: "mds.svg",
        father: 17,
        description: "Fallout exploits the fact that faulting loads due to a non-present page fault can pick up previously stored values from the store buffer if the least-significant 12 bits of the virtual addresses match.",
        sources: [
            sources["Canella2019"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "Fallout",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Store Buffer Data Sampling (MSBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ], 
        cve: [{
            title: "CVE-2018-12126",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12126"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        color: color.works
    },
    {
        id: 49,
        title: "Meltdown-P-LP",
        alias: "RIDL",
        img: "mds.svg",
        father: 17,
        description: "Intel, the RIDL paper, and Brandon Falk describe that faulting loads which span a 64-byte cacheline boundary may leak data from the processor's load ports.",
        sources: [
            sources["Falk2019"],
            sources["VanSchaik2019"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "Rogue In-flight Data Load (RIDL)",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Load Port Data Sampling (MLPDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12127",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12127"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        poc: [{
            title: "https://github.com/vusec/ridl",
            url: "https://github.com/vusec/ridl",
        }],
        color: color.works
    },
    {
        id: 50,
        title: "Meltdown-CPL-REG",
        alias: "v3a",
        father: 15,
        description: "Meltdown-CPL-REG allows an attacker to read privileged system registers. It was first discovered and published by ARM and subsequently Intel determined that their CPUs are also susceptible to the attack. Accessing privileged system registers (e.g., via <code>rdmsr</code>) raises a general protection fault (#GP) when the current privilege level (CPL) is not zero. Similarly to previous Meltdown-type attacks, however, the attack exploits the fact that the transient execution following the faulting instruction can still compute on the unauthorized data, and leak the system register contents through a microarchitectural covert channel.",
        sources: [
            sources["ARM2018"],
            sources["Intel2018"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/meltdown/GP"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/rogue-system-register-read"
            },
            {
                title: "ARM",
                url: "https://developer.arm.com/support/arm-security-updates/speculative-processor-vulnerability"
            }
        ],
        names: [
            {
                title: "Variant 3a",
            },
            {
                title: "Rogue System Register Read (RSRR)",
                url: "https://software.intel.com/security-software-guidance/api-app/sites/default/files/336983-Intel-Analysis-of-Speculative-Execution-Side-Channels-White-Paper.pdf"
            }
        ], 
        cve: [{
            title: "CVE-2018-3640",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-3640"
        }],
        color: color.works
    },
    {
        id: 51,
        title: "Meltdown-NC-SB",
        alias: "Fallout",
        img: "mds.svg",
        father: 15,
        description: "Meltdown-NC-SB abuses #GP exceptions from non-canonical addresses to read data from the store buffer.",
        todo: "We encourage investigation of using non-canonical loads to leak data from other buffers.",
        sources: [
            sources["Canella2019"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "Fallout",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Store Buffer Data Sampling (MSBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ], 
        cve: [{
            title: "CVE-2018-12126",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12126"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        color: color.works
    },
{
        id: 59,
        title: "Meltdown-AVX",
        father: 15,
        description: "Meltdown-AVX abuses #GP exceptions caused by misaligned AVX vector load instructions. According to Intel, faulting or assisting vector SSE/AVX loads that are more than 64 bits in size may leak data.",
        color: color.works,
        sources: [
            sources["IntelMDS"],
            sources["Canella2019"],
            sources["RIDLAddendum1"],
        ],
        color: color.group
},
{
        id: 65,
        title: "Meltdown-AVX-SB",
        alias: "Fallout",
        img: "mds.svg",
        father: 59,
        description: "Meltdown-AVX-SB abuses #GP exceptions caused by misaligned AVX load instructions to read data from the store buffer.",
        sources: [
            sources["Canella2019"],
        ],
        names: [
            {
                title: "Fallout",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Store Buffer Data Sampling (MSBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12126",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12126"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        color: color.works
    },
{
        id: 66,
        title: "Meltdown-AVX-LP",
        alias: "RIDL",
        img: "mds.svg",
        father: 59,
        description: "Meltdown-AVX-LP abuses #GP exceptions caused by misaligned AVX load instructions to read data from the load ports.",
        sources: [
            sources["RIDLAddendum1"],
            sources["Falk2019"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "Rogue In-flight Data Load (RIDL) Addendum",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Load Port Data Sampling (MLPDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12127",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12127"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        poc: [{
            title: "https://github.com/vusec/ridl",
            url: "https://github.com/vusec/ridl",
        }],
        color: color.works
    },
    {
        id: 52,
        title: "Meltdown-MCA",
        text_bottom: "fault/assist type",
        father: 3,
        description: "To support more complex instructions, microcode enables higher-level instructions to be implemented using multiple hardware-level instructions. This allows processor vendors to support complex behavior and even extend or modify CPU behavior through microcode updates. While the execution units perform the fast-paths directly in hardware, more complex slow-path operations, such as faults or page-table modifications, are typically performed by issuing a microcode assist which points the sequencer to a predefined microcode routine. This microcode assist triggers a machine clear, which flushes the pipeline. On a pipeline flush, instructions which are already in flight still finish execution, which can leak, producing a Meltdown effect.</p>Microcode assists can be caused by a variety of conditions, and have been abused to leak data from a range of buffers. Our extensible classification therefore splits Meltdown-MCA further based on the specific microcode assist and targeted microarchitectural buffer.",
        todo: "We encourage exploration of other microcode assist triggers.",
        sources: [
            sources["Schwarz2019"],
            sources["Canella2019"],
            sources["IntelMDS"],
        ],
        color: color.group
    },
    {
        id: 53,
        title: "Meltdown-AD",
        img: "pte-ad.svg",
        father: 52,
        description: "If a page-table walk requires an update to the accessed or dirty bits in one of the corresponding page-table entries, it falls back to a microcode assist. Such microcode-assisted page table walks have been abused to extract data from different buffers. We therefore categorize Meltdown-AD further by the leakage source.",
        sources: [
            sources["Schwarz2019"],
            sources["Canella2019"],
            sources["IntelMDS"],
        ],
        color: color.group
    },
    {
        id: 54,
        title: "Meltdown-AD-L1",
        father: 53,
        description: "Attackers might attempt to abuse A/D microcode assists to read cached L1 data, but we have not experimentally confirmed that this is possible.",
        todo: "We encourage investigation of reading L1-cached data through A/D microcode assists.",
        color: color.todo
    },
    {
        id: 55,
        title: "Meltdown-AD-LFB",
        alias: "ZombieLoad v3",
        img: "zombieload.svg",
        father: 53,
        description: "ZombieLoad uses various architectural and microarchitectural faults to leak data from the fill buffers. In contrast to Meltdown-US-L1, only the least-significant 6 bits of the virtual address can be used to address the data, thus giving less control over which data is leaked. However, this allows ZombieLoad to cross all privilege boundaries (user-to-user, kernel, Intel SGX, VM-to-VM, VM-to-hypervisor). In this variant, the exploited fault is the microcode assist required for setting the accessed or dirty bit in a page-table entry.",
        sources: [
            sources["Schwarz2019"],
        ],
        poc: [{
            title: "https://github.com/IAIK/ZombieLoad",
            url: "https://github.com/IAIK/ZombieLoad/tree/master/attacker/variant2_windows"
        }],
        names: [
            {
                title: "ZombieLoad",
                url: "https://zombieloadattack.com/"
            },
            {
                title: "Microarchitectural Fill Buffer Data Sampling (MFBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12130",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12130"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        color: color.works
    },
    {
        id: 56,
        title: "Meltdown-AD-SB",
        alias: "Fallout",
        img: "mds.svg",
        father: 53,
        description: "Fallout exploits the fact that faulting loads can pick up previously stored values from the store buffer if the least-significant 12 bits of the virtual address match. This variant exploits the fact that setting the accessed or dirty bit in the page-table entry leads to a microarchitectural fault in the form of a microcode assist.",
        sources: [
            sources["Canella2019"]
        ],
        names: [
            {
                title: "Fallout",
                url: "https://mdsattacks.com/"
            },
            {
                title: "Microarchitectural Store Buffer Data Sampling (MSBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ], 
        cve: [{
            title: "CVE-2018-12126",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12126"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        color: color.works
    },
    {
        id: 57,
        title: "Meltdown-AD-LP",
        father: 53,
        description: "Attackers might attempt to abuse A/D microcode assists to read CPU load port data, but we have not experimentally confirmed that this is possible.",
        todo: "We encourage investigation of reading CPU load port data through A/D microcode assists.",
        sources: [
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "Microarchitectural Load Port Data Sampling (MLPDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12127",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12127"
        }],
        color: color.todo
    },
        {
        id: 60,
        title: "Meltdown-TAA",
        father: 52,
        description: "Attackers might attempt to abuse TSX asynchronous aborts (TAA) to leak CPU data from the fill buffer, store buffer, and load ports.",
        alias: "ZombieLoad v2, RIDL",
        img: "zombieload.svg",
        sources: [
            sources["Schwarz2019"],
            sources["RIDLAddendum1"],
            sources["IntelTAA"],
        ],
        names: [
            {
                title: "TSX Asynchronous Aborts (TAA)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-transactional-synchronization-extensions-intel-tsx-asynchronous-abort"
            },
            {
                title: "ZombieLoad v2",
                url: "https://zombieloadattack.com/"
            },
            {
                title: "Rogue In-flight Data Load (RIDL) Addendum",
                url: "https://mdsattacks.com/"
            },
        ],
        cve: [{
            title: "CVE-2019-11135",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2019-11135"
        }],
        color: color.group
    },
    {
        id: 61,
        title: "Meltdown-TAA-LFB",
        father: 60,
        description: "Attackers might attempt to abuse TSX asynchronous aborts (TAA) to leak CPU data from the fill buffer.",
        alias: "ZombieLoad v2",
        img: "zombieload.svg",
        sources: [
            sources["Schwarz2019"],
            sources["RIDLAddendum1"],
        ],
        names: [
            {
                title: "TSX Asynchronous Aborts (TAA)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-transactional-synchronization-extensions-intel-tsx-asynchronous-abort"
            },
            {
                title: "ZombieLoad v2",
                url: "https://zombieloadattack.com/"
            },
            {
                title: "Rogue In-flight Data Load (RIDL) Addendum",
                url: "https://mdsattacks.com/"
            },
        ],
        cve: [{
            title: "CVE-2019-11135",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2019-11135"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-transactional-synchronization-extensions-intel-tsx-asynchronous-abort"

            },
        ],
        poc: [{
            title: "https://github.com/IAIK/ZombieLoad",
            url: "https://github.com/IAIK/ZombieLoad/"
        },
        {
            title: "https://github.com/vusec/ridl",
            url: "https://github.com/vusec/ridl",
        }],
        color: color.works
    },
    {
        id: 62,
        title: "Meltdown-TAA-LP",
        father: 60,
        description: "Attackers might attempt to abuse TSX asynchronous aborts (TAA) to leak CPU data from the load port write back data bus.",
        alias: "ZombieLoad v2",
        img: "zombieload.svg",
        sources: [
            sources["Schwarz2019"],
            sources["RIDLAddendum1"],
            sources["Falk2019"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "TSX Asynchronous Aborts (TAA)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-transactional-synchronization-extensions-intel-tsx-asynchronous-abort"
            },
            {
                title: "ZombieLoad v2",
                url: "https://zombieloadattack.com/"
            },
            {
                title: "Rogue In-flight Data Load (RIDL) Addendum",
                url: "https://mdsattacks.com/"
            },
        ],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-transactional-synchronization-extensions-intel-tsx-asynchronous-abort"

            },
        ],
        cve: [{
            title: "CVE-2019-11135",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2019-11135"
        }],
        poc: [{
            title: "https://github.com/IAIK/ZombieLoad",
            url: "https://github.com/IAIK/ZombieLoad/"
        },
        {
            title: "https://github.com/vusec/ridl",
            url: "https://github.com/vusec/ridl",
        }],
        color: color.works
    },
    {
        id: 63,
        title: "Meltdown-TAA-SB",
        father: 60,
        description: "Attackers might attempt to abuse TSX asynchronous aborts (TAA) to leak CPU data from the store buffer.",
        alias: "ZombieLoad v2",
        img: "zombieload.svg",
        sources: [
            sources["Schwarz2019"],
            sources["RIDLAddendum1"],
        ],
        names: [
            {
                title: "TSX Asynchronous Aborts (TAA)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-transactional-synchronization-extensions-intel-tsx-asynchronous-abort"
            },
            {
                title: "ZombieLoad v2",
                url: "https://zombieloadattack.com/"
            },
            {
                title: "RIDL Addendum",
                url: "https://mdsattacks.com/files/ridl-addendum.pdf"
            }
        ],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-transactional-synchronization-extensions-intel-tsx-asynchronous-abort"

            },
        ],
        poc: [{
            title: "https://github.com/IAIK/ZombieLoad",
            url: "https://github.com/IAIK/ZombieLoad/"
        },
        {
            title: "https://github.com/vusec/ridl",
            url: "https://github.com/vusec/ridl",
        }],
        cve: [{
            title: "CVE-2019-11135",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2019-11135"
        }],
        color: color.works
    },
    {
        id: 72,
        title: "Meltdown-PRM-LFB",
        father: 52,
        alias: "ZombieLoad v4",
        img: "zombieload.svg",
        description: "SGX-enabled processors trigger a microcode assist whenever an address translation resolves into SGX's Processor Reserved Memory (PRM) area and the CPU is outside enclave mode. While this ensures that the load instruction always reads 0xff at the architectural level, we found however that unauthorized line-fill buffer entries accessed by the sibling logical core may still be transiently dereferenced before abort page semantics are applied.",
        todo: "We encourage investigation of using SGX processor-reserved memory to leak data from other buffers.",
        sources: [
            sources["Schwarz2019"],
        ],
        names: [
            {
                title: "ZombieLoad v4",
                url: "https://zombieloadattack.com/"
            },
            {
                title: "Microarchitectural Fill Buffer Data Sampling (MFBDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2018-12130",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-12130"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/microarchitectural-data-sampling"
            },
        ],
        poc: [{
            title: "https://github.com/IAIK/ZombieLoad/",
            url: "https://github.com/IAIK/ZombieLoad/tree/master/attacker/variant4_linux"
        }],
        color: color.works
    },
    {
        id: 73,
        title: "Meltdown-UC-LFB",
        father: 52,
        alias: "ZombieLoad v5",
        img: "zombieload.svg",
        description: "The ZombieLoad paper includes a variant that uses a memory page which is marked as uncacheable. As the page-miss handler issues a microcode assist when page tables are in uncacheable memory, we can leak data from the line-fill buffer. Likewise, the original Meltdown paper includes an experiment to leak victim data which is marked as uncacheable.",
        todo: "We encourage investigation of using uncacheable memory pages to leak data from other buffers.",
        sources: [
            sources["Schwarz2019"],
            sources["Lipp2018"],
            sources["IntelMDS"],
        ],
        names: [
            {
                title: "ZombieLoad v5",
                url: "https://zombieloadattack.com/"
            },
            {
                title: "Microarchitectural Data Sampling Uncacheable Memory (MDSUM)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
            {
                title: "Microarchitectural Data Sampling (MDS)",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling"
            },
        ],
        cve: [{
            title: "CVE-2019-11091",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2019-11091"
        }],
        color: color.works
    },
];
var current_data = data;
