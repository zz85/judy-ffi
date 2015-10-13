var Judy = require('../lib/judy');
//var faker = require('faker');

var USE_JUDY = 1; 

var j = new Judy();
var h = {};

function stats() {
	var mem = process.memoryUsage();
	console.log('--------------------');
	console.log('RSS', (mem.rss / 1024 / 1024).toFixed(2) + 'MB');
	console.log('Heap Total', (mem.heapTotal / 1024 / 1024).toFixed(2) + 'MB');
	console.log('Heap Used', (mem.heapUsed / 1024 / 1024).toFixed(2) + 'MB');
	
//	console.log('Uptime', process.uptime());
	console.log('--------------------');
}


var NUMBER = 1 * 1000 * 1000;
var counter = 0;
var TARGET = 5 * 1000 * 1000;


var start = Date.now(); 

var CHARS = 'ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

function makeRandomName() {
	var str = '';
	for (var i = 0; i < 20; i++) {
		str += CHARS.charAt(Math.random() * CHARS.length | 0);
	}
	
	return str;
}

function insert() {
	console.log('\n');
	console.time('insert');
	for (var i = 0; i < NUMBER; i++) {
		var key = 'key' + counter;
//		var randomName = faker.helpers.createCard()
//		var randomName = faker.internet.email();
		var randomName = makeRandomName();
		if (i === 0) console.log(randomName, 'randomName');
		if (USE_JUDY) {
			j.put(key, randomName);
		} else {
			h[key] = randomName;	
		}
			
//		h[key] = randomName + '_' + i;
//		h[key] = JSON.stringify(randomName);
		counter++;
	}
	console.timeEnd('insert');
	console.log('Completed', counter);
	stats();
	
	if (counter >= TARGET) {
		console.log('Took', (Date.now () - start) / 60 / 1000, 'min')
		testLoads();
		return;
	}
	
	setTimeout(insert, 1000);
}


stats();
insert();

function testLoads() {
	console.time('gets')
	for (var i = 0; i < counter; i++) {
		var key = 'key' + i;
		if (USE_JUDY) {
			var value = j.get(key);	
		} else {
			var value = h[key];			
		}
		
		if (i % 1000000 === 0) console.log(key, value);
	}
	console.timeEnd('gets')
}

/*
 avg: 400ms for 100,000
 5M - 40MB
 
 --------------------
insert: 345ms
Completed 7800000
--------------------
RSS 81.63MB
Heap Total 72.39MB
Heap Used 39.13MB
--------------------

--------------------
insert: 495ms
Completed 6700000
--------------------
RSS 99.23MB
Heap Total 89.12MB
Heap Used 63.86MB
--------------------


~~~~~~~~~~~ NORMAL ~~~~~~~~~~~~~~~~~


node test_memory.js --expose_gc                                                           [15:53:27]
--------------------
RSS 35.28MB
Heap Total 27.74MB
Heap Used 14.40MB
--------------------


O0Pvk1gnZI randomName
insert: 2272ms
Completed 1000000
--------------------
RSS 223.46MB
Heap Total 210.62MB
Heap Used 186.95MB
--------------------


suuJjmnez4 randomName
insert: 2828ms
Completed 2000000
--------------------
RSS 302.10MB
Heap Total 289.34MB
Heap Used 261.99MB
--------------------


JsditOthsh randomName
insert: 4247ms
Completed 3000000
--------------------
RSS 666.16MB
Heap Total 654.11MB
Heap Used 622.58MB
--------------------


H654VnAIZk randomName
insert: 3081ms
Completed 4000000
--------------------
RSS 742.92MB
Heap Total 729.88MB
Heap Used 701.72MB
--------------------


T1qEzigDgb randomName
insert: 4176ms
Completed 5000000
--------------------
RSS 817.61MB
Heap Total 805.66MB
Heap Used 780.85MB
--------------------
Took 0.5129833333333333 min
key0 O0Pvk1gnZI
key1000000 suuJjmnez4
key2000000 JsditOthsh
key3000000 H654VnAIZk
key4000000 T1qEzigDgb
gets: 3401ms


node test_memory.js --expose_gc                                                           [15:24:39]

~~~~~~~~~~~ REUSE STRINGS ~~~~~~~~~~~~~~~~~



insert: 5625ms
Completed 6000000
--------------------
RSS 325.47MB
Heap Total 310.99MB
Heap Used 227.87MB
--------------------
Took 0.8911833333333333 min

Took 1.1452 min
gets: 4021ms



~~~~~~~~~~~ JUDY ~~~~~~~~~~~~~~~~~




 node test_memory.js --expose_gc                                                           [15:38:33]
--------------------
RSS 35.32MB
Heap Total 28.72MB
Heap Used 13.07MB
--------------------


Milan_Hilll@gmail.com randomName
insert: 38091ms
Completed 1000000
--------------------
RSS 109.88MB
Heap Total 46.69MB
Heap Used 14.61MB
--------------------


Myrl_Windler85@yahoo.com randomName
insert: 45411ms
Completed 2000000
--------------------
RSS 111.93MB
Heap Total 47.68MB
Heap Used 24.11MB
--------------------


Ottilie63@hotmail.com randomName
insert: 46316ms
Completed 3000000
--------------------
RSS 112.11MB
Heap Total 47.68MB
Heap Used 20.63MB
--------------------


Turner.Dietrich@gmail.com randomName
insert: 45916ms
Completed 4000000
--------------------
RSS 111.62MB
Heap Total 47.68MB
Heap Used 16.57MB
--------------------


Hiram.Kilback50@hotmail.com randomName
insert: 45771ms
Completed 5000000
--------------------
RSS 111.76MB
Heap Total 47.68MB
Heap Used 24.35MB
--------------------
Took 6.052833333333333 min
key0 Hiram.Kilback50@hotmail.com
key1000000 undefined
key2000000 undefined
key3000000 undefined
key4000000 undefined
gets: 92732ms




-------------JS BIG STRINGS--------------

node test_memory.js --expose_gc                                                           [15:54:42]
--------------------
RSS 35.29MB
Heap Total 27.74MB
Heap Used 14.40MB
--------------------


0yHjVY7YOitoUvD4g3NT randomName
insert: 8315ms
Completed 1000000
--------------------
RSS 529.57MB
Heap Total 511.77MB
Heap Used 492.24MB
--------------------


56OIHuv1T7B8BfheWSN1 randomName
insert: 8654ms
Completed 2000000
--------------------
RSS 910.18MB
Heap Total 900.49MB
Heap Used 869.85MB
--------------------


2dSZDqxmBuQB4RQAjHYD randomName



_DNF _ 3minutes


-------------------JUDY BIG STRINGS------------------------
 node test_memory.js --expose_gc                                                           [15:58:50]
--------------------
RSS 35.92MB
Heap Total 28.72MB
Heap Used 12.64MB
--------------------


171lOgGodPxKKCbcWqdq randomName
insert: 32974ms
Completed 1000000
--------------------
RSS 110.72MB
Heap Total 47.68MB
Heap Used 18.56MB
--------------------


lXdHspPTeUNon1MvE8MY randomName
insert: 33042ms
Completed 2000000
--------------------
RSS 162.84MB
Heap Total 47.68MB
Heap Used 17.80MB
--------------------


Y0Tvyu8lpyF9Iz3QpqSM randomName
insert: 35216ms
Completed 3000000
--------------------
RSS 215.14MB
Heap Total 47.68MB
Heap Used 17.41MB
--------------------


Sp9q2JQtnAHwY1f9D3JR randomName
insert: 33674ms
Completed 4000000
--------------------
RSS 267.18MB
Heap Total 47.68MB
Heap Used 15.08MB
--------------------


gTamvmNvmJKbNXAFweIW randomName
insert: 35551ms
Completed 5000000
--------------------
RSS 319.39MB
Heap Total 47.68MB
Heap Used 15.98MB
--------------------
Took 4.606883333333333 min
key0 171lOgGodPxKKCbcWqdq
key1000000 lXdHspPTeUNon1MvE8MY
key2000000 Y0Tvyu8lpyF9Iz3QpqSM
key3000000 Sp9q2JQtnAHwY1f9D3JR
key4000000 gTamvmNvmJKbNXAFweIW
gets: 103844ms


5M / 10s
500K / 1s

*/