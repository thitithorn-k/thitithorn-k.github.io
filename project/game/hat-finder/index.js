// Path finder function start in line 196
// change default setting of generator in line 17-20
// uncomment line 70 to wipe console for every time moving

// show log to element
(function () {
    var old = console.log;
    var logger = document.getElementById(element='log');
    console.log = function (message, element) {
        if (typeof message == 'object') {
            logger.innerHTML = (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML = message + '<br />';
        }
    }
})();

// const prompt = require("prompt-sync")({ sigint: true });

const hat = '🟥';
const hole = '⬛';
const fieldCharacter = '⬜';
const pathCharacter = '🟩';
let game_end = false;

class Field {
    constructor(options) {
        // default value to create Field
        const defaults = {
            field: undefined,
            gen_x: 20,
            gen_y: 20,
            percentage: 50,
            random_start: true
        }

        // console.log(options.length);
        this.current_pos = [0, 0];
        this.hat_pos = [];

        // if nothing pass to options let it generate with default value
        if (options === undefined) options = defaults;
        // if pass array to options set this.field to that array
        else if (options.length !== undefined) options.field = Array.from(options);

        // if field is set
        if (options.field) {
            this.field = options.field;

            // find start and hat position
            let found_start = false;
            let found_hat = false;
            for (let y in this.field) {
                for (let x in this.field[y]) {
                    if (!found_start && this.field[y][x] === pathCharacter) {
                        this.current_pos[0] = Number(y);
                        this.current_pos[1] = Number(x);
                        found_start = true;
                    }
                    if (!found_hat && this.field[y][x] === hat) {
                        this.hat_pos[0] = Number(y);
                        this.hat_pos[1] = Number(x);
                        found_hat = true;
                    }
                    if(found_start && found_hat) break;
                }
            }

        } else {
            // if field isn't set, generate it
            if (!options.gen_x) options.gen_x = defaults.gen_x;
            if (!options.gen_y) options.gen_y = defaults.gen_y;
            if (!options.hole_num) options.hole_num = defaults.hole_num;
            if (options.random_start === undefined) options.random_start = defaults.random_start;
            this.field = this.generateField(options.gen_y, options.gen_x, options.percentage, options.random_start);
        }
        
        // console.log('have way= ', isHaveWay(this.current_pos, this.hat_pos, this.field));
        this.print();
        // this.getPlayerInput();
    }

    print() {
        // console.clear();
        // console.log(this.field.join('\n'), 'field');
        var logger = document.getElementById('field');
        let message = this.field.join('\n');
        if (typeof message == 'object') {
            logger.innerHTML = (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML = message + '<br />';
        }
    }

    // getPlayerInput() {
    //     const input = prompt('Which way? ');
    //     this.move(input);
    // }

    move(input) {
        if(game_end){
            location.reload();
            return;
        }
        const next_move = [0, 0]; // [y, x]
        // check player input
        switch (input.toLowerCase()) {
            case 'w':
                next_move[0] = -1;
                break;
            case 's':
                next_move[0] = 1;
                break;
            case 'a':
                next_move[1] = -1;
                break;
            case 'd':
                next_move[1] = 1;
                break;
            default:
                console.log('Invalid input.');
                // this.getPlayerInput();
        }

        //check next posistion
        const next_pos_y = this.current_pos[0] + next_move[0];
        const next_pos_x = this.current_pos[1] + next_move[1];

        // check out of bounds / exit program if it is
        if ((next_pos_x < 0 || next_pos_x > this.field[0].length - 1) || (next_pos_y < 0 || next_pos_y > this.field.length - 1)) {
            alert('Out of bound');
            console.log('Press any key to new game.');
            game_end = true;
            return;
        }

        // check hat, hole and update current_pos
        const next_pos_content = this.field[next_pos_y][next_pos_x];
        switch (next_pos_content) {
            case hole:
                alert('Sorry, you fell down a hole');
                console.log('Press any key to new game.');
                game_end = true;
                return;
            case hat:
                alert('Congrats, you found your hat.');
                console.log('Press any key to new game.');
                game_end = true;
                return;
            case fieldCharacter:
                this.field[next_pos_y][next_pos_x] = pathCharacter;
                this.current_pos[0] = next_pos_y;
                this.current_pos[1] = next_pos_x;
                break;
        }
        this.print();
        // this.getPlayerInput(); // this will call player input again and again without whileloop
    }

    generateField(height = 5, width = 5, percentage = 25, random_start = false) {
        // for performance time check, end in line  192
        const start_func_time = performance.now();

        // function to random int
        const rand = (x) => {
            return Math.floor(Math.random() * x);
        }

        // generate field and fill with fieldCharacter
        let new_field = Array.from({ length: height }, row => Array(width).fill(fieldCharacter));

        //set start position
        if (random_start) {
            const start_x = rand(width);
            const start_y = rand(height);
            new_field[start_y][start_x] = pathCharacter;
            this.current_pos[0] = start_y;
            this.current_pos[1] = start_x;
        } else {
            new_field[0][0] = pathCharacter;
        }

        // generate random holes
        let hole_num = (height * width) * (percentage / 100);
        let cant_find_way = 10;
        for (let i = 0; i < hole_num + 1; i++) {
            const rand_pos = [rand(height), rand(width)];
            if (new_field[rand_pos[0]][rand_pos[1]] === fieldCharacter) {
                if (i === 0) {
                    new_field[rand_pos[0]][rand_pos[1]] = hat;
                    this.hat_pos[0] = rand_pos[0];
                    this.hat_pos[1] = rand_pos[1];
                } else {
                    new_field[rand_pos[0]][rand_pos[1]] = hole;
                    const haveWay = isHaveWay(this.current_pos, this.hat_pos, new_field);
                    if(!haveWay){
                        new_field[rand_pos[0]][rand_pos[1]] = fieldCharacter;
                        if(cant_find_way > 0){
                            i--;
                            // console.log('cant=', cant_find_way, ' [',rand_pos,']');
                            cant_find_way--;
                        } else {
                            console.log(`can't find any more space in 10 times. (current hole: ${i-1})`);
                            hole_num = i-1;
                            break;
                        }
                    } else {
                        cant_find_way = 10;
                    }
                }   

            } else {
                i--;
            }
        }

        // for performance time check, start in line  136
        const end_func_time = performance.now();
        console.log(`Generate ${width}x${height} with ${hole_num} holes in ${(end_func_time-start_func_time)/1000} sec.\nYou are ${pathCharacter}. Find the way to ${hat}.\nPress (W,A,S,D) to move.`);

        // return field
        return new_field;
    }
}


// A* Pathfinding ดัดแปลงเดิน4ทิศ

// ต้องการ parameter 3 ตัว
// start_pos = [y, x] ของจุดเริ่มต้น
// end_pos = [y, x] ของจุดหมวก
// field = Array ของ ตาราง

// return true ถ้ามีทางจากจุดเริ่มต้นไปถึงหมวก
// return false ถ้าไม่เจอทาง

// **มีการเรียกใช้ตัวแปรนอกฟังก์ชันคือ fieldCharacter และ hat ในบรรทัดที่ 252, 253
const isHaveWay = (start_pos, end_pos, field) => {
    const already_scans = []; // id of slot
    let found = false;
    const step_queues = []; //[f, current_pos]

    // เช็คว่าช่องที่ส่งมาเคยคำนวณไปแล้วหรือยัง
    // ถ้ายังให้เพิ่มเข้าไปใน already_scans แล้ว return true
    // ถ้าเคยแล้ว return false
    // สร้าง id ของช่องโดยเริ่มที่ 0 ไล่ตั้งแต่ซ้ายบนสุดไปทางขวา
    const isUnscanned = (current_pos) => {
        const id = (current_pos[0] * field[0].length) + current_pos[1];
        if (already_scans.indexOf(id) === -1) {
            already_scans.push(id);
            return true;
        }
        return false;
    }

    // หาค่า F
    // F = G + H
    // F = จำนวนช่องจากจุดเริ่มต้น + จำนวนช่องไปถึงหมวก
    // หาได้จาก |x1-x2| + |y1-y2| // |x| = ค่าสัมบูรณ์ของ x
    const getFCost = (current_pos) => { // return cost of f
        const g = Math.abs(current_pos[1] - start_pos[1]) + Math.abs(current_pos[0] - start_pos[0]);
        const h = Math.abs(current_pos[1] - end_pos[1]) + Math.abs(current_pos[0] - end_pos[0]);
        return g + h;
    }

    // เพิ่มช่องเข้าไปในคิว โดยเรียงให้ค่า F น้อยที่สุดอยู่ด้านหน้า
    const addToQueue = (step) => {
        for(let i in step_queues){
            if(step_queues[i][0] > step[0]){
                step_queues.splice(i, 0, step);
                return;
            }
        }
        step_queues.splice(step_queues.length, 0, step)
        return;
    }

    // เช็คว่าช่องที่ให้มาเดินได้ หรือเป็นหมวก
    // return 0 ถ้าเป็นหลุม หรืออยู่นอกfield
    // return 1 ถ้าเป็นช่องที่เดินได้
    // return 3 ถ้าเป็นหมวก
    const isWalkable = (current_pos) => { //0 = unwalkable 1=walkable 2=hat
        if(current_pos[0] < 0 || current_pos[0] >= field.length || current_pos[1] < 0 || current_pos[1] >= field[0].length) return 0;
        const charInSlot = field[current_pos[0]][current_pos[1]];
        if(charInSlot === fieldCharacter) return 1;
        if(charInSlot === hat) return 2;
        return 0;
    }

    // เริ่มต้นทำงาน
    // ดึงช่องที่มี F ต่ำที่สุดมาหาช่องที่ไปต่อได้ทั้ง 4 ทิศ
    // ถ้า queue หมดแล้ว แสดงว่าไม่มีทางไป return false
    // เช็คแต่ละช่องว่าเดินผ่านได้หรือไม่
    // ถ้าเป็นหมวก return true
    // ถ้าเดินผ่านได้ คำนวณหา F และนำไปใส่ queue
    // เรียกฟังก์ชัน processStep ใหม่อีกครั้ง
    const processStep = () => {
        const selected_step = step_queues.shift();
        if(selected_step === undefined) return false;
        const next_step = [
            [selected_step[1][0]-1, selected_step[1][1]],
            [selected_step[1][0]+1, selected_step[1][1]],
            [selected_step[1][0], selected_step[1][1]-1],
            [selected_step[1][0], selected_step[1][1]+1]
        ];

        for(each_next of next_step){
            const walkable_res = isWalkable(each_next);
            if(walkable_res === 2){
                return true;
            } else if(walkable_res === 1) {
                if(isUnscanned(each_next)){
                    addToQueue([getFCost(each_next), each_next]);
                }
            }
        }
        return processStep();
    }

    // เพิ่มจุดเริ่มต้นเข้าไปในคิว
    start_step = [0, start_pos] // f, current_pos
    addToQueue(start_step);

    return processStep();
}


// Start the program and wait for user input
// console.log(`Please select field\n1: Default from codeacademy\n2: Custom array\n3: Random hole with default size\n4: Custom Random`)
let select_field = prompt('Please select field\n1: Default from codeacademy\n2: Custom array\n3: Random hole with default size\n4: Custom Random\n5: Close this prompt');
while (isNaN(Number(select_field)) || Number(select_field)<= 0 || Number(select_field>5)) {
    console.log('Invalid choice.');
    select_field = prompt('Please select field\n1: Default from codeacademy\n2: Custom array\n3: Random hole with default size\n4: Custom Random\n5: Close this prompt');
}

let myField;
switch ((Number(select_field))) {
    case 1:
        myField = new Field([
            ['🟩', '⬜', '⬛'],
            ['⬜', '⬛', '⬜'],
            ['⬜', '🟥', '⬜'],
        ]);
        break;
    case 2:
        while (true) {
            console.log("Enter array of field\nEx.[['1', '0', '3'], ], ['0', '3', '0'], ['0', '2', '0']\n0=fieldCharacter\n1=start location\n2=hat\n3=hole");
            const field_array_string = prompt('Array: ');
            try {
                const field_array = JSON.parse(field_array_string);
                for (let y in field_array) {
                    for (let x in field_array[y]) {
                        const contain = field_array[y][x];
                        switch (contain) {
                            case 0:
                                field_array[y][x] = '░';
                                break;
                            case 1:
                                field_array[y][x] = '*';
                                break;
                            case 2:
                                field_array[y][x] = '^';
                                break;
                            case 3:
                                field_array[y][x] = 'O';
                                break;
                        }
                    }
                }
                myField = new Field(field_array);
                break;
            } catch {
                continue;
            }
        }
        break;
    case 3:
        myField = new Field();
        break;
    case 4:
        let gen_x = prompt('field width= ');
        gen_x = gen_x !== '' ? Number(gen_x) : 5;
        let gen_y = prompt('fidle height= ');
        gen_y = gen_y !== '' ? Number(gen_y) : 5;
        let percentage = prompt('percentage of holes= ');
        percentage = percentage !== '' ? Number(percentage) : 20;
        let random_start = (prompt('random start (true1/false0)= '));
        if (random_start === 0 || random_start === '0' || random_start === 'false' || random_start === '') {
            random_start = false;
        } else {
            random_start = true;
        }
        myField = new Field({ gen_x: gen_x, gen_y: gen_y, percentage: percentage, random_start: random_start });
        break;
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    myField.move(evt.key);
};