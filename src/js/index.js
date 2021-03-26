import "modern-normalize";
import "../scss/style.scss";

// const Chart = require("chart.js");

var grand_total = 10e8;
window.isEmbedded = window.self !== window.top;

document.addEventListener("DOMContentLoaded", () => {
    // pull the data
    fetchData();

    // base of the chart
    document
        .getElementById("xxx")
        .setAttribute("d", describeArc(100, 100, 100, 0, 270));
});

const fetchData = () => {
    fetch(
        "https://orchid-ui.s3.amazonaws.com/OXT_Treasury_Wallet_Balances.json?t=" +
            Date.now()
    )
        .then((res) => res.json())
        .then((res) => {
            // re
            render(res);
            // res
            // balance_total = res.TOTAL.balance;
        });
};

const render = (data) => {
    //
    // const table = document.createElement("table");

    // render table heading
    // const thead = document.createElement("thead");
    // ["Source", "Address", "Balance"].forEach((label) => {
    //     const th = document.createElement("th");
    //     th.innerText = label;
    //     thead.appendChild(th);
    // });
    // // add thead
    // table.appendChild(thead);
    const table = document.querySelector(".table-content");

    // render table body
    for (const i in data) {
        if (data[i].coin) {
            const sdiv = document.createElement("div");
            //
            sdiv.innerHTML = "<strong>" + i + "</strong>";
            sdiv.innerHTML += "<small>" + data[i]["address"] + "</small>";
            table.append(sdiv);

            const bdiv = document.createElement("div");
            bdiv.innerHTML =
                "<span>" + numberFormat(data[i]["balance"]) + "</span>";
            // add data
            table.append(bdiv);
        }
    }

    const balance_total = data.TOTAL.balance;
    // console.log(balance_total);

    const ratio = (balance_total / grand_total) * 100;
    document.querySelector(".balance-total span").innerText = numberFormat(
        balance_total
    );

    document
        .getElementById("xxx2")
        .setAttribute("d", describeArc(100, 100, 100, 0, (ratio * 270) / 100));

    if (isEmbedded) {
        // send size to parent frame
        window.top.postMessage(
            {
                action: "iframeResize",
                height: document.body.scrollHeight,
                // width: document.body.scrollWidth,
            },
            "*"
        );
    }
};

const numberFormat = (string) => {
    if (string == null) return 0;
    return new Intl.NumberFormat("en-US", {
        style: "decimal",
    }).format(string.toString());
};

const polarToCartesian = (x, y, radius, deg) => ({
    x: x + radius * Math.cos(((deg - 90) * Math.PI) / 180),
    y: y + radius * Math.sin(((deg - 90) * Math.PI) / 180),
});

const describeArc = (x, y, radius, start_deg, end_deg) => {
    const start = polarToCartesian(x, y, radius, end_deg);
    const end = polarToCartesian(x, y, radius, start_deg);
    return [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        end_deg - start_deg <= 180 ? "0" : "1",
        0,
        end.x,
        end.y,
    ].join(" ");
};
