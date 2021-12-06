const axios = require('axios');

// // get stock/etf ticker info
// var ticker = 'AMD';
// var assetClass = 'stocks'; //etf
// var stock = await axios.get(
// 	`https://api.nasdaq.com/api/quote/${ticker}/info?assetclass=${assetClass}`
// );

// //get stock/etf option info
// var queryLimit = 200;
// var fromDate = '2021-09-03'; //2021-09-03 YMD
// var toDate = '2021-09-24'; //
// var money = 'at'; // at the money or all money for the option query

// var stock = await axios.get(
// 	`https://api.nasdaq.com/api/quote/${ticker}/option-chain?assetclass=${assetClass}&limit=${queryLimit}&fromdate=${fromDate}&todate=${toDate}&excode=oprac&callput=callput&money=${money}&type=all`
// );

// -------------- FUTURES SECTION ---------------

//get future info
async function futuresQuote() {
	var futureID = '133'; //snp 500 - /ES
	//var unixTime = new Date().valueOf();
	var future = await axios.get(
		`https://www.cmegroup.com/CmeWS/mvc/Quotes/Future/${futureID}/G` //&_t=${unixTime}
	);
	var currentQuote = future.data.quotes[0];
	console.log(currentQuote.last);
}

//get future option info

// run quote getters
futuresQuote();
