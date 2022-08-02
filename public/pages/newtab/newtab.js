const suggest = {
    //ddg: "https://duckduckgo.com/ac/?kl=jp-jp&q={str}",
    ddg: "https://server5.isnow.jp/apis/ddg.php?kl=jp-jp&q={str}",
}

const sinput = $("#sq");
const sfm = $("#seform");

var datasets = [];

function sie(){
    var siv = sinput.val();
    $.getJSON(suggest.ddg.replace("{str}",siv)).then((d)=>{
        var tmpval = [];
        datasets.length = 0;
        d.forEach(v => {
            let ev = v.phrase.toLowerCase();
            if (!tmpval.includes(ev)) {
                tmpval.push(ev);
                datasets.push({label: ev});
            }
        });
    })
}

sinput.on("input",sie);

const ac = new Autocomplete(sinput.get(0), {
    data: datasets,
    maximumItems: 10,
    treshold: 2,
    highlightTyped: true,
    highlightClass: 'text-primary',
    onSelectItem: ({label, value})=>{
        sfm.trigger("submit");
    }
});

sfm.on("submit",(e)=>{
    e.preventDefault();
    window.location.href = "https://www.ecosia.org/search" + "?" + "q" + "=" + encodeURI(sinput.val());
})