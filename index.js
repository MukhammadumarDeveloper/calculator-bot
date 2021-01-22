require('dotenv').config();

const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const session = require('telegraf/session');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

bot.start((ctx) => {
    console.log('1');
    ctx.reply('Welcome to calculator', Markup
        .keyboard([
            ['7', '8', '9', '*'],
            ['4', '5', '6', '/'],
            ['1', '2', '3', '-'],
            ['0', '.', '=', '+', 'C']
        ])
        .resize()
        .extra())
});

bot.on('message', async (ctx) => {
    // ctx.session.son1 = ctx.session.son1 || '';
    // ctx.session.son1+= ctx.message.text;
    // if(ctx.message.text === 'C') ctx.session.son1 = 0
    // await ctx.deleteMessage();

    // ctx.reply(ctx.session.son1);

    if (/^\d+$/.test(ctx.message.text)) {
        if (ctx.session.operator) {
            ctx.session.son2 = ctx.session.son2 || '';
            ctx.session.son2 += ctx.message.text;
            await ctx.deleteMessage();
            ctx.reply(ctx.session.son1);
        } else {
            ctx.session.son1 = ctx.session.son1 || '';
            ctx.session.son1 += ctx.message.text;

            await ctx.deleteMessage();
            ctx.reply(ctx.session.son1);
        }

    } else if (/[+*\/-]/g.test(ctx.message.text)) {
        if (ctx.session.son1) {
            ctx.session.operator = ctx.message.text;
            ctx.session.son2 = '';
            ctx.reply('Son1 ' + ctx.session.son1 +
                ' ' + ctx.session.operator);
        } else {
            ctx.reply('avval son1ni kirit...');
        }
    } else if (ctx.message.text === "=") {
        if (ctx.session.son1 &&
            ctx.session.son2 &&
            ctx.session.operator) {
            let result = eval(
                ctx.session.son1 +
                ctx.session.operator +
                ctx.session.son2
            );
            ctx.reply(ctx.session.son1 +
                ctx.session.operator + ' ' + ctx.session.son2 + '=' + result);
        } else {
            // ctx.reply('Qaytadan harakat qiling!');
        }
        ctx.session.son1 = null;
        ctx.session.son2 = null;
        ctx.session.operator = null;

    } else {
        ctx.reply('Nuqta bosildi');
    } if (ctx.message.text === "C") {
        ctx.session.son1 = 0;
    }


});
bot.launch();