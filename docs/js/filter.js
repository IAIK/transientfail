var index = {};
function buildIndex() {
    index = {};
    for(let node of data) {
        if(index[node.id] !== undefined) {
            alert("Duplicate ID " + node.id + ": " + node.title + " and " + index[node.id].title);
        }
        index[node.id] = node;
    }
}

function hasParent(node, parent_id) {
    var parent = node;
    while(parent !== undefined && parent.father != null) {
        parent = index[parent.father];
        if(parent === undefined) return false;
        if(parent.id == parent_id) return true;
    }
    return false;
}

function hasChild(node, child_id) {
    var child = index[child_id];
    return hasParent(child, node.id);
}

function toggleMeltdownSpectre(meltdown, spectre, filterInclude) {
    current_data = [];
    for(let node of data) {
        var is_meltdown = hasParent(node, 3) || node.id == 3;
        var is_spectre = hasParent(node, 2) || node.id == 2;
        if((spectre && is_spectre) || (meltdown && is_meltdown) || (!is_meltdown && !is_spectre)) {
            if(filterInclude(node)) {
                current_data.push(node);
            }
        }
    }
    // remove empty groups
    var removed;
    do {
        removed = 0;
        var has_children = {};
        for(let node of current_data) {
            if(node.father !== null) has_children[node.father] = true;
        }
        var cleaned_data = [];
        for(let node of current_data) {
            if(has_children[node.id] !== undefined || node.color != color.group) {
                cleaned_data.push(node);
            } else {
                removed++;
            }
        }    
        current_data = cleaned_data;
    } while(removed);
    
    tree.refresh(current_data);
}

function recursiveFlatten(input) {
    result = "";
    if(typeof(input) == "string") {
        result += input + " ";
    }
    else if(typeof(input) == "object") {
        if(Array.isArray(input)) {
            for(let element of input) {
                result += recursiveFlatten(element) + " ";
            }
        } else {
            for(let key of Object.keys(input)) {
                result += recursiveFlatten(input[key]) + " ";
            }
        }
    }
    return result;
}

function filter() {
    var show_meltdown = $("#toggleMeltdown").prop("checked");
    var show_spectre = $("#toggleSpectre").prop("checked");
    var show_todo = $("#toggleTodo").prop("checked");
    var show_fails = $("#toggleFails").prop("checked");
    var show_working = $("#toggleWorking").prop("checked");

    // var show_paper = $("#togglePaper").prop("checked");
    // var show_nopaper = $("#toggleNoPaper").prop("checked");

    var show_l1 = $("#toggleL1").prop("checked");
    var show_lfb = $("#toggleLFB").prop("checked");
    var show_sb = $("#toggleSB").prop("checked");
    var show_lp = $("#toggleLP").prop("checked");
    var show_reg = $("#toggleREG").prop("checked");
    var show_mem = $("#toggleMEM").prop("checked");

    var show_intel = $("#toggleIntel").prop("checked");
    var show_arm = $("#toggleARM").prop("checked");
    var show_amd = $("#toggleAMD").prop("checked");
    //var show_ibm = $("#toggleIBM").prop("checked");

    var search_term = $("#search").val();    
    var has_search = search_term.trim().length > 0;
    var show_poc = $("#togglePoC").prop("checked");
    var show_nopoc = $("#toggleNoPoC").prop("checked");
    var search_popup = 0;
    
    toggleMeltdownSpectre(show_meltdown, show_spectre, function(node) {
        var is_leaf = node.color != color.group && node.color != color.root;
        
        if(node.todo !== undefined && node.color == color.todo && !show_todo) 
            return false;
        if(node.color == color.fails && !show_fails)
            return false;
        if(node.color == color.works && !show_working)
            return false;
        
        /*
        var has_paper = false;
        if(node.sources !== undefined) {
            for(let s of node.sources) {
                if(s.conference !== undefined) {
                    has_paper = true;
                    break;
                }
            }
        }
        if(has_paper && !show_paper && is_leaf)
            return false;
        if(!has_paper && !show_nopaper && is_leaf)
            return false;
        */
        
        if(node.poc !== undefined && node.poc.length > 0 && is_leaf && !show_poc) 
            return false;
        if((node.poc === undefined || node.poc.length == 0) && is_leaf && !show_nopoc) 
            return false;

        var include = false;
        if(node.affects !== undefined) {
            for(let a of node.affects) {
                if(a.title === "Intel" && show_intel) {
                    include = true;
                    break;
                }
                if(a.title === "AMD" && show_amd) {
                    include = true;
                    break;
                }
                if(a.title === "ARM" && show_arm) {
                    include = true;
                    break;
                }
                /*if(a.title === "IBM" && show_ibm) {
                    include = true;
                    break;
                }*/
            }
            if (!include) return false;
        }

        var has_l1 = node.title.indexOf("-L1") != -1;
        var has_lfb = node.title.indexOf("-LFB") != -1;
        var has_sb = node.title.indexOf("-SB") != -1;
        var has_lp = node.title.indexOf("-LP") != -1;
        var has_reg = node.title.indexOf("-REG") != -1;
        var has_mem = !has_l1 && !has_lfb && !has_sb && !has_lp && !has_reg && (node.color == color.works);
        
        if(has_l1 && is_leaf && !show_l1)
            return false;
        if(has_lfb && is_leaf && !show_lfb)
            return false;
        if(has_sb && is_leaf && !show_sb)
            return false;
        if(has_lp && is_leaf && !show_lp)
            return false;
        if(has_reg && is_leaf && !show_reg)
            return false;
        if(has_mem && is_leaf && !show_mem)
            return false;
         
        if(has_search && is_leaf)
        {
            if(node.description.toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
               node.title.toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&   
               (node.alias||"").toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
               (node.affects||[]).map(x => x.title||x).join(" ").toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
               (node.names||[]).map(x => x.title||x).join(" ").toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
               recursiveFlatten(node.sources).toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
               (node.cve||[]).map(x => x.title||x).join(" ").toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
               (node.poc||[]).map(x => x.title||x).join(" ").toLowerCase().indexOf(search_term.toLowerCase()) == -1
            )
                return false;
            /* automatically popup the first leaf hit when searching */
            else if(!search_popup)
            {
                search_popup = 1;
                popup(node);
            }
        }
        
        return true;
    }
    );
} 
