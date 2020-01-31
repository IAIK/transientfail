var sources = {
    "Canella2018": {
            "title": "A Systematic Evaluation of Transient Execution Attacks and Defenses",
            "author": "Claudio Canella, Jo Van Bulck, Michael Schwarz, Moritz Lipp, Benjamin von Berg, Philipp Ortner, Frank Piessens, Dmitry Evtyushkin, Daniel Gruss",
            "url": "https://arxiv.org/pdf/1811.05441.pdf",
            "conference": "USENIX Security 2019"
    },
    "Kocher2019": {
            title: "Spectre Attacks: Exploiting Speculative Execution",
            author: "Paul Kocher, Jann Horn, Anders Fogh, Daniel Genkin, Daniel Gruss, Werner Haas, Mike Hamburg, Moritz Lipp, Stefan Mangard, Thomas Prescher, Michael Schwarz, Yuval Yarom",
            url: "https://spectreattack.com/spectre.pdf",
            conference: "IEEE S&P 2019"
    },
    "Lipp2018": {
            title: "Meltdown: Reading Kernel Memory from User Space",
            author: "Moritz Lipp, Michael Schwarz, Daniel Gruss, Thomas Prescher, Werner Haas, Anders Fogh, Jann Horn, Stefan Mangard, Paul Kocher, Daniel Genkin, Yuval Yarom, Mike Hamburg",
            url: "https://meltdownattack.com/meltdown.pdf",
            conference: "USENIX Security 2018"
    },
    "Schwarz2019": {
            title: "ZombieLoad: Cross-Privilege-Boundary Data Sampling",
            author: "Michael Schwarz, Moritz Lipp, Daniel Moghimi, Jo Van Bulck, Julian Stecklina, Thomas Prescher, Daniel Gruss",
            url: "https://zombieloadattack.com/zombieload.pdf",
            conference: "ACM CCS 2019"
    },
    "Evtyushkin2018": {
            title: "BranchScope: A New Side-Channel Attack on Directional Branch Predictor",
            author: "Dmitry Evtyushkin, Ryan Riley, Nael Abu-Ghazaleh, Dmitry Ponomarev",
            url: "http://www.cs.ucr.edu/~nael/pubs/asplos18.pdf",
            conference: "ASPLOS 2018"
    },
    "Fog": {
            url: "https://www.agner.org/optimize/microarchitecture.pdf",
            author: "Agner Fog",
            title: "The microarchitecture of Intel, AMD and VIA CPUs"
    },
    "Maisuradze2018": {
            url: "https://arxiv.org/pdf/1807.10364.pdf",
            title: "ret2spec: Speculative Execution Using Return Stack Buffers",
            author: "Giorgi Maisuradze, Christian Rossow",
            conference: "ACM CCS 2018"
    },
    "Koruyeh2018": {
            url: "https://www.usenix.org/system/files/conference/woot18/woot18-paper-koruyeh.pdf",
            title: "Spectre Returns! Speculation Attacks using the Return Stack Buffer",
            author: "Esmaeil Mohammadian Koruyeh, Khaled N. Khasawneh, Chengyu Song, Nael Abu-Ghazaleh",
            conference: "USENIX WOOT 2018"
    },
    "Horn2018": {
            url: "https://bugs.chromium.org/p/project-zero/issues/detail?id=1528",
            title: "Speculative execution, variant 4: speculative store bypass",
            author: "Jann Horn"
    },
    "Stecklina2018": {
            url: "https://arxiv.org/pdf/1806.07480.pdf",
            title: "LazyFP: Leaking FPU Register State using Microarchitectural Side-Channels",
            author: "Julian Stecklina, Thomas Prescher"
    },
    "Intel2018": {
            url: "https://software.intel.com/security-software-guidance/api-app/sites/default/files/336996-Speculative-Execution-Side-Channel-Mitigations.pdf",
            author: "Intel",
            title: "Speculative Execution Side Channel Mitigations"
    },
    "ARM2018": {
            url: "https://developer.arm.com/support/arm-security-updates/speculative-processor-vulnerability/download-the-whitepaper",
            author: "ARM",
            title: "Whitepaper Cache Speculation Side-channels"
    },
    "VanBulck2018": {
            title: "Foreshadow: Extracting the Keys to the Intel SGX Kingdom with Transient Out-of-Order Execution",
            author: "Jo Van Bulck, Marina Minkin, Ofir Weisse, Daniel Genkin, Baris Kasikci, Frank Piessens, Mark Silberstein, Thomas F. Wenisch, Yuval Yarom, Raoul Strackx",
            url: "https://foreshadowattack.eu/foreshadow.pdf",
            conference: "USENIX Security 2018"
    },
    "Weisse2018": {
            title: "Foreshadow-NG: Breaking the Virtual Memory Abstraction with Transient Out-of-Order Execution",
            author: "Ofir Weisse, Jo Van Bulck, Marina Minkin, Daniel Genkin, Baris Kasikci, Frank Piessens, Mark Silberstein, Raoul Strackx, Thomas F. Wenisch, Yuval Yarom",
            url: "https://foreshadowattack.eu/foreshadow-NG.pdf"
    },
    "Kiriansky2018": {
            url: "https://arxiv.org/pdf/1807.03757.pdf",
            title: "Speculative Buffer Overflows: Attacks and Defenses",
            author: "Vladimir Kiriansky, Carl Waldspurger"
    },
    "VanSchaik2019": {
            title: "RIDL: Rogue In-flight Data Load",
            author: "Stephan van Schaik, Alyssa Milburn, Sebastian Österlund, Pietro Frigo, Giorgi Maisuradze, Kaveh Razavi, Herbert Bos, Cristiano Giuffrida",
            url: "https://mdsattacks.com/files/ridl.pdf",
            conference: "IEEE S&P 2019"
    },
    "RIDLAddendum1": {
            title: "Addendum 1 to RIDL: Rogue In-flight Data Load",
            author: "Stephan van Schaik, Alyssa Milburn, Sebastian Österlund, Pietro Frigo, Giorgi Maisuradze, Kaveh Razavi, Herbert Bos, Cristiano Giuffrida",
            url: "https://mdsattacks.com/files/ridl-addendum.pdf",
            conference: "Addendum to IEEE S&P 2019 paper",
    },
    "Canella2019": {
            title: "Fallout: Leaking Data on Meltdown-Resistant CPUs",
            author: "Claudio Canella, Daniel Genkin, Lukas Giner, Daniel Gruss, Moritz Lipp, Marina Minkin, Daniel Moghimi, Frank Piessens, Michael Schwarz, Berk Sunar, Jo Van Bulck, Yuval Yarom",
            url: "https://dl.acm.org/doi/abs/10.1145/3319535.3363219",
            conference: "ACM CCS 2019"
    },
    "IntelMDS": {
            url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-analysis-microarchitectural-data-sampling",
            author: "Intel",
            title: "Deep Dive: Intel Analysis of Microarchitectural Data Sampling"
    },
    "IntelTAA": {
            url: "https://software.intel.com/security-software-guidance/insights/deep-dive-intel-transactional-synchronization-extensions-intel-tsx-asynchronous-abort",
            author: "Intel",
            title: "Deep Dive: Intel Transactional Synchronization Extensions (Intel TSX) Asynchronous Abort"
    },
    "Chen2019": {
            title: "SGXPECTRE: Stealing Intel Secrets from SGX Enclaves via Speculative Execution",
            author: "Guoxing Chen, Sanchuan Chen, Yuan Xiao, Yinqian Zhang, Zhiqiang Lin, Ten H. Lai",
            conference: "IEEE EuroS&P 2019",
            url: "https://arxiv.org/pdf/1802.09085.pdf"
    },
    "Falk2019": {
            author: "Brandon Falk",
            title: "CPU Introspection: Intel Load Port Snooping",
            url: "https://gamozolabs.github.io/metrology/2019/12/30/load-port-monitor.html",
            conference: "Gamozo Labs Blog",
    },
};
 
