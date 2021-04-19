const axios = require("axios"),
    cheerio = require ("cheerio"),
    request = require('request'),
    mysql = require('./mysql'),
    data = new Date();


const bot ='https://api.telegram.org/bot1666423369:AAHlNldUfQTCaEGHlvTrOfmjvxmyLBFpe7o/sendMessage';

const parse = async () =>{
    const getHTML = async (url) =>{
        const {data} = await axios.get(url);
        return cheerio.load(data);
    };
    // ~~~~~~~~~~~~[Avito]~~~~~~~~~~~~~
    const $ = await getHTML("https://www.avito.ru/petrozavodsk/avtomobili?cd=1&f=ASgBAgICAUTyCrCKAQ&pmax=30000");

    $('.iva-item-root-G3n7v').each((i,element) =>{
        const name = $(element).find('.text-bold-3R9dt').text();
        const price = $(element).find('.price-text-1HrJ_').text();
        const link = `https://www.avito.ru${$(element).find('a').attr('href')}`;
        mysql.query(`SELECT * FROM avito WHERE link = ? LIMIT 1`, [link],function(err, res){
            if (err) throw err;
            if (res[0] != null) return console.log("false");
            botTrigger(`${name}\nЦена: ${price}\n${link}`);
            mysqlInster('avito', name, link);
       });
    });
    // ~~~~~~~~~~~~[AVTO]~~~~~~~~~~~~~
    const AVTO = await getHTML("https://auto.ru/petrozavodsk/cars/used/?price_to=30000");

    AVTO('.ListingItem-module__container').each((i,element) =>{
        const name = AVTO(element).find('.ListingItem-module__title').text();
        const price = AVTO(element).find('.ListingItemPrice-module__content').text();
        const link = `${AVTO(element).find('a').attr('href')}`;
        // const FR = await getHTML(link);
        // const data = FR('.CardHead-module__info-item').text();
        mysql.query(`SELECT * FROM avto WHERE link = ? LIMIT 1`, [link],function(err, res){
            if (err) throw err;
            if (res[0] != null) return console.log("false");

            botTrigger(`${name}\nЦена: ${price}\n${link}`);
            mysqlInster('avto', name, link);
       });
    });
    // ~~~~~~~~~~~~[Дром ]~~~~~~~~~~~~~
    const DROM = await getHTML("https://petrozavodsk.drom.ru/auto/all/?minprice=8000&maxprice=30000")

    DROM('.ListingItem-module__container').each((i,element) =>{
        const name = DROM(element).find('.ListingItem-module__title').text()
        const price = DROM(element).find('.ListingItemPrice-module__content').text()
        const link = `${DROM(element).find('a').attr('href')}`

        mysql.query(`SELECT * FROM drom WHERE link = ? LIMIT 1`, [link],function(err, res){
            if (err) throw err
            if (res[0] != null) return console.log("false")

            botTrigger(`${name}\nЦена: ${price}\n${link}`)
            mysqlInster('drom', name, link)
       })
    })


    function botTrigger(textBot){
        request({
            method: 'GET',
            url: bot,
            qs: {
                chat_id: '-1001456431422',
                text: textBot
            }
            }, function (error, response, body) {
                console.log(response.statusCode);
            });
    }
    function mysqlInster (tebel, name, link){
        mysql.query(`INSERT INTO ${tebel} (name, link, time) VALUES(?,?,?)`, [name, link, data.getMonth()]);
        mysql.query(`DELETE FROM ${tebel} WHERE time = time+1`);
    }
    mysql.end();
}
parse();