var cron = require('node-cron');

/**
 * ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
 */

// 매일 아침 9시에 동작
cron.schedule('0 9 * * *', function () {
    console.log('running a task every morning AM 9:00');

    // TODO: 오늘할일을 입력해주세요. 알람 전송
});

// 매일 저녁 9시에 동작
cron.schedule('0 21 * * *', function () {
    console.log('running a task every night PM 9:00');

    // TODO: 오늘할일에 대한 결과를 알람으로 전송
});


cron.schedule('* * * * *', function () {
    console.log('running a task every minute');

    // TODO: 오늘할일에 대한 결과를 알람으로 전송
});