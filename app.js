const express = require('express');
const ExpressError = require('./expressError');

const app = express();

app.get('/mean', (req, res, next) => {
	try {
		if (!req.query.nums) {
			throw new ExpressError('nums are required', 400);
		}
		const nums = req.query.nums.split(',');
		let total = 0;
		for (let num of nums) {
			if (isNaN(num)) {
				throw new ExpressError(`${num} is not a number`, 400);
			}
			total += +num;
		}
		let mean = total / nums.length;
		return res.json({
			response : {
				operation : 'mean',
				value     : mean
			}
		});
	} catch (e) {
		next(e);
	}
});

app.get('/median', (req, res, next) => {
	try {
		if (!req.query.nums) {
			throw new ExpressError('nums are required', 400);
		}
		const arr = req.query.nums.split(',');
		const nums = [];
		let median;

		for (let num of arr) {
			if (isNaN(num)) {
				throw new ExpressError(`${num} is not a number`, 400);
			}
			nums.push(+num);
		}

		let index = Math.floor((nums.length + 1) / 2) - 1;
		nums.sort((a, b) => a - b);

		if (nums.length % 2 != 0) {
			median = nums[index];
		} else {
			median = (nums[index] + nums[index + 1]) / 2;
		}

		return res.json({
			response : {
				operation : 'median',
				value     : median
			}
		});
	} catch (e) {
		next(e);
	}
});

app.get('/mode', (req, res, next) => {
	try {
		if (!req.query.nums) {
			throw new ExpressError('nums are required', 400);
		}
		const arr = req.query.nums.split(',');
		const count = {};
		let max = 0;
		const modes = [];

		for (let num of arr) {
			if (isNaN(num)) {
				throw new ExpressError(`${num} is not a number`, 400);
			}
			count[num] = (count[num] || 0) + 1;

			if (count[num] >= max) {
				max = count[num];
			}
		}

		for (key in count) {
			if (count[key] === max) {
				modes.push(+key);
			}
		}

		return res.json({
			response : {
				operation : 'mode',
				value     : modes
			}
		});
	} catch (e) {
		next(e);
	}
});

// 404 error handler
app.use(function(req, res, next) {
	const err = new ExpressError('Not Found', 404);

	// pass the error to the next piece of middleware
	return next(err);
});

// Error handler
app.use(function(err, req, res, next) {
	let status = err.status || 500;
	let message = err.msg;

	return res.status(status).json({
		error : { message, status }
	});
});

app.listen(3000, function() {
	console.log('App on port 3000');
});
