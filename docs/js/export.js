function getTranslation(obj) {
    if(obj.transform === undefined) return [0,0];
    if(obj.transform.baseVal === undefined) return [0,0];
    for(let op of obj.transform.baseVal) {
        if(op.type == 2) {
            return [op.matrix.e, op.matrix.f];
        }
    }
    return [0,0];
}

function exportTikz() {
    var header = "\\begin{tikzpicture}[node distance=0.9cm,transform shape,scale=0.55]\n";
    header += "\\tikzstyle{small}  = [rectangle, rounded corners, minimum width=2.5cm, minimum height=.6cm,text centered, draw=black, fill=white]\n";
    header += "\\tikzstyle{large}  = [rectangle, rounded corners, minimum width=3.8cm, minimum height=.6cm,text centered, draw=black, fill=white]\n";
    header += "\\tikzstyle{works}  = [fill=red!30!white,thick,font=\\bfseries]\n";
    header += "\\tikzstyle{fails}  = [densely dashed,pattern=north west lines,pattern color=green!60!white]\n";
    header += "\\tikzstyle{todo}   = [fill=red!30!yellow,thick,font=\\bfseries]\n";
    header += "\\tikzstyle{group}  = [fill=blue!20!white]\n";
    header += "\\tikzstyle{arrow}  = [thick,->,>=stealth,in=180,out=0,looseness=0.6]\n";
    header += "\\tikzstyle{arrow_regular}  = [thick,->,>=stealth]\n";

    header += "\\usetikzlibrary{shapes.geometric, arrows, patterns}\n";

    var content = "";
    
    var arrows = "";
    for(let node of $("#tree svg g.node")) {
        var pos = getTranslation(node);
        var id = $(node).find(".box").prop("id").substr(2);
        var node_obj = index[id];
        var name = node_obj.title;
        
        var style = "works";
        if(node_obj.color == color.group) style = "group";
        else if(node_obj.color == color.fails) style = "fails";
        else if(node_obj.color == color.todo) style = "todo";
        
        content += "\\node[large," + style + "] (node" + id + ") at (" + ((pos[0] / 40.0) * 0.9) + "," + (-pos[1] / 40.0) + ") {" + name + "};\n";
        
        if(node_obj.father !== null) {
            arrows += "\\draw (node" + index[node_obj.father].id + ".east) edge[arrow_regular] (node" + id +".west);\n";
        }
        
    }
    
    content += arrows;

    var footer = "\\end{tikzpicture}\n";
    
    var tikz = header + content + footer;
    var blob = new Blob([ tikz ], {type:"text/x-pgf;charset=utf-8"});
    window.saveAs(blob, "tree.tikz");
}

function exportSVG() {
    var header = '<?xml version="1.0" standalone="no"?>\n';
    
    var corr_pos = getTranslation($("#tree svg g g")[0]);

    var empty_svg = $("#tree svg").clone().html("").get()[0];
    empty_svg.setAttribute("transform", "translate(" + (corr_pos[0]) + "," + (corr_pos[1]) +")");
    empty_svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    var root = $("#tree svg")[0];
    empty_svg.setAttribute("transform", "");
    
    var content = empty_svg.outerHTML.replace("</svg>", "");
    content += "<g>";
    
    var path_count = 0;
    for(let node of $("#tree svg g")) {
        var cn = node.className.baseVal;

        if(cn === undefined || cn != "node") {
            path_count++;
            if(path_count == 1) continue;
            content += node.outerHTML;
        } else {
            var name = $(node).find("strong").text();
            var enode = $(node).clone();
            
            var box = $(node).find("div.box")[0];
            var bg = (box !== undefined ? box.style.backgroundColor : "white");
            
            enode.html('<svg width="180" height="25"><rect x="0" y="0" rx="5" ry="5" width="180" height="25" fill="' + bg + '" /><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-weight="bold">' + name + '</text></svg>');
            
            var jenode = enode.get()[0];
            
            pos = getTranslation(jenode); 
            jenode.setAttribute("transform", "translate(" + (pos[0] + corr_pos[0]) + "," + (pos[1] + corr_pos[1]) +")");
            content += jenode.outerHTML;
        }
        
    }
    
    var footer = "</g></svg>";
    var svg = header + content + footer;
    var blob = new Blob([ svg ], {type:"image/svg+xml;charset=utf-8"});
    window.saveAs(blob, "tree.svg");

}

function exportDOT() {
    var header = "digraph tree {\n";

    var content = "rankdir=LR;\n";

    var defined = [];

    var makeUnique = (x) => x.title.replace(/[^A-Za-z0-9]*/g, "") + x.id;

    var arrows = "";
    for(let node of $("#tree svg g.node")) {
        var id = $(node).find(".box").prop("id").substr(2);
        var node_obj = index[id];
        var name = node_obj.title;
        var unique = makeUnique(node_obj);

        var shape = "box";
        if(node_obj.color == color.group) shape = "oval";
        else if(node_obj.color == color.fails) shape = "box";
        else if(node_obj.color == color.todo) shape = "box";

        if(defined.indexOf(unique) == -1) {
            content += unique + " [label=\"" + name + "\",shape=" + shape + "];\n";
            defined.push(unique);
        }

        if(node_obj.father !== null) {
            var funique = makeUnique(index[node_obj.father]);
            content += funique + " -> " + unique + ";\n";
        }

    }

    var footer = "}\n";

    var tikz = header + content + footer;
    var blob = new Blob([ tikz ], {type:"text/x-dot;charset=utf-8"});
    window.saveAs(blob, "tree.dot");
}

