const axios = require('axios');
const fs = require('fs');
var blessed = require('blessed'),
	contrib = require('blessed-contrib'),
	screen = blessed.screen();

// first run is to initally draw the table.
var runs = 0;
tickers = [];
/*
133 - ES (S&P500)
146 - NQ (NASDAQ)
8314 - RTY (RUSSELL)
318 - YM (DOW)
8478 - BTC (BITCOIN)
*/
futureIDs = [133, 146, 8314, 318];
var displayData = [];

var grid = new contrib.grid({ rows: 1, cols: 2, screen: screen });

futuresTable = contrib.table({
	//keys: true,
	fg: 'white',
	selectedFg: 'white',
	selectedBg: 'clear',
	//interactive: true,
	label: 'Futures',
	width: '100%',
	height: '100%',
	border: { type: 'line', fg: 'green' },
	columnSpacing: 5,
	columnWidth: [8, 8, 8, 8, 8, 8, 8],
});

futuresTable.focus();
screen.append(futuresTable);

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
	return process.exit(0);
});

screen.render();

// ------------------- STOCK/ETF SECTION --------------

// // get stock/etf ticker info
async function tickerQuote(ticker, assetClass) {
	//var assetClass = 'stocks'; //etf
	var stock = await axios.get(
		`https://api.nasdaq.com/api/quote/${ticker}/info?assetclass=${assetClass}`
	);
	var currentQuote = stock.data;
	stockData[stockData.length] = currentQuote;
}

// -------------- FUTURES SECTION ---------------

//get future info
async function futuresQuote(futureID) {
	var future = await axios.get(
		`https://www.cmegroup.com/CmeWS/mvc/Quotes/Future/${futureID}/G` //&_t=${unixTime}
	);
	var response = future.data.quotes[0];
	//console.log(response.updated);
	var quote = [
		response.code,
		response.last,
		response.high,
		response.low,
		response.change,
		response.percentageChange,
		response.updated,
	];
	if (displayData.length === 0) {
		displayData.push(quote);
	} else {
		var updated = false;
		for (var i = 0; i < displayData.length; i++) {
			if (displayData[i][0] == quote[0]) {
				displayData[i] = quote;
				updated = true;
			}
		}
		if (updated == false) {
			displayData.push(quote);
		}
	}

	displayData.sort();
	futuresTable.setData({
		headers: ['Symbol', 'Last', 'High', 'Low', 'Change', 'Change %', 'Updated'],
		data: displayData,
	});
	screen.render();
}

// run quote getters

updateTable();

// ---------------- ACCESSORY FUNCTIONS ---------------------------
function updateTable() {
	ms = 1000;
	if (runs > 1) {
		ms = 1000;
	}
	sleep(ms).then(() => {
		futureIDs.forEach((id) => {
			futuresQuote(id);
		});
		updateTable();
	});
	runs++;
}

function sleep(milliseconds) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// //get stock/etf option info

// var queryLimit = 200;
// var fromDate = '2021-09-03'; //2021-09-03 YMD
// var toDate = '2021-09-24'; //
// var money = 'at'; // at the money or all money for the option query

// var stock = await axios.get(
// 	`https://api.nasdaq.com/api/quote/${ticker}/option-chain?assetclass=${assetClass}&limit=${queryLimit}&fromdate=${fromDate}&todate=${toDate}&excode=oprac&callput=callput&money=${money}&type=all`
// );

//get future option info
