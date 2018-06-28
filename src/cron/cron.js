const nodeCron = require('node-cron');
const logger = require('../lib/logger');

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
const morningScheduler = nodeCron.schedule('0 9 * * *', () => {
    logger.info('running a task every morning AM 9:00');
    // TODO: 오늘할일을 입력해주세요. 알람 전송
});

// 매일 저녁 9시에 동작
const nightScheduler = nodeCron.schedule('0 21 * * *', () => {
    logger.info('running a task every night PM 9:00');
    // TODO: 오늘할일에 대한 결과를 알람으로 전송
});

const testScheduler = nodeCron.schedule('*/10 * * * *', () => {
    logger.info('running a task every minute');
});

const initialize = () => {
    morningScheduler.start();
    nightScheduler.start();
    testScheduler.start();
}

module.exports = initialize;
