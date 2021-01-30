export function getDaysInMonths(date: Date) {
	const currYear = date.getFullYear()

	const daysInMonths = {
		0: 31,
		1: 28,
		2: 31,
		3: 30,
		4: 31,
		5: 30,
		6: 31,
		7: 31,
		8: 30,
		9: 31,
		10: 30,
		11: 31,
	}

	// Check for leap year
	if ((!(currYear % 4) && currYear % 100) || !(currYear % 400)) {
		daysInMonths[1] = 29
	}

	return daysInMonths
}

function generateDays(date: Date, daysInMonths: { [month: number]: number }) {
	// account for year rollover
	const lastMonth = date.getMonth() === 0 ? 11 : date.getMonth() - 1
	const lastMonthYear =
		date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear()
	const nextMonth = date.getMonth() === 11 ? 0 : date.getMonth() + 1
	const nextMonthYear =
		date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear()

	const days = []
	// Get previous month lapover days
	for (
		let index = 0;
		index < new Date(date.getFullYear(), date.getMonth(), 1).getDay();
		index++
	) {
		days.unshift(index)
	}
	// Get current months days
	for (let index = 1; index < daysInMonths[date.getMonth()] + 1; index++) {
		days.push(index)
	}
	// Get next month lapover days

	for (
		let index = 0;
		index <
		6 -
			new Date(
				date.getFullYear(),
				date.getMonth(),
				daysInMonths[date.getMonth()]
			).getDay();
		index++
	) {
		days.push(index)
	}
}
