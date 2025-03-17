var selectedAvatar;
let nombre;
let scores = [{ usuario: "", score: 0 , fecha:""}];
localStorage.setItem('scores', JSON.stringify(scores));
let img3Vidas;
let img2Vidas;
let img1Vidas;
let fechaActual;
let countGallinas=0;

/* Para uso de canvas ---------------------------------------------------------------------- */
let canvas = document.getElementById("pantallaInicio");
let ctx = canvas.getContext("2d");

let bgImage=new Image();
let logo=new Image();

bgImage.src="media/mainBG.png";
logo.src="media/name.png";

//para agregar el logo con una animacion
//necesitamos algunas variables
let baseY = 10;      // Posición inicial del logo 
let offsetY = 0;     // Desplazamiento desde la posición base
let direction = 1;   // Dirección: 1 (sube), -1 (baja)
let speed = 0.3;     // Velocidad de subida/bajada
let maxOffset = 10;  // Cuánto se quiere mover arriba/abajo

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //dibujar el fondo
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // Actualizar offset (sube o baja)
    offsetY += direction * speed;

    // Cambiar dirección al llegar a los límites 
    if (offsetY > maxOffset || offsetY < -maxOffset) {
        direction *= -1;
    }

    // Dibujar logo en nueva posición
    ctx.drawImage(logo, 1, baseY + offsetY, 500, 192);

    // Seguir animando
    requestAnimationFrame(animate);
}

// Esperar que la imagen cargue
logo.onload = function() {
    animate();  // Iniciar la animación
}

//mostar las siguientes pantallas
function pantalla_Avatar(){
    // Ocultar la pantalla inicial
    document.getElementById('mainPantalla').style.display = 'none';
    // Mostrar la pantalla de selección de avatar
    document.getElementById('pantallaAvatar').style.display = 'grid';
}

function pantalla_Instrucciones(){
    // Ocultar la pantalla inicial
    document.getElementById('mainPantalla').style.display = 'none';
    document.getElementById('pantallaInstrucciones').style.display = 'flex';
}

function pantalla_Creditos(){
    // Ocultar la pantalla inicial
    document.getElementById('mainPantalla').style.display = 'none';
    document.getElementById('pantallaCreditos').style.display = 'flex';
}

function pantalla_scores(){
    document.getElementById('mainPantalla').style.display = 'none';
    document.getElementById('pantallaScores').style.display = 'flex';
}

//si regresa de avatar a pantalla de inicio
function backMain1(){
    document.getElementById('pantallaAvatar').style.display = 'none';
    document.getElementById('mainPantalla').style.display = 'block';

    if(selectedAvatar!=null){
        //si es diferente de nulo, significa que ya habia elegido algo,
        //y luego regresó, entonces hay que reestablecer
        resetAvatarSelection();
        //vaciar el dropzone
        var dropzone = document.getElementById("dropzone");
        dropzone.innerHTML = ""; 
    }
}

//si regresa de instrucciones a pantalla de inicio
function backMain2(){
    document.getElementById('pantallaInstrucciones').style.display = 'none';
    document.getElementById('mainPantalla').style.display = 'block';
}

//si regresa de creditos a pantalla de inicio
function backMain3(){
    document.getElementById('pantallaCreditos').style.display = 'none';
    document.getElementById('mainPantalla').style.display = 'block';
}

//si regresa de score a pantalla inicio
function backMainScore(){
    document.getElementById('pantallaScores').style.display = 'none';
    document.getElementById('mainPantalla').style.display = 'block';
}

//si regrsesa de pantallaUsario a avatar
function backToPantalla_Avatar(){
    document.getElementById('pantallaUsuario').style.display = 'none';
    document.getElementById('pantallaAvatar').style.display = 'grid';
}

/* Para drag and drop ---------------------------------------------------------------------- */
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer?.setData("text", ev.target.id); // Soporte para drag clásico
    startDragTouch(ev); // Manejo táctil
}

function drop(ev) {
    ev.preventDefault();

    if (selectedAvatar != null) {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Ya elegiste un avatar"
        });
        return;
    }

    const data = ev.dataTransfer?.getData("text");
    const draggedElement = data ? document.getElementById(data) : currentTouchElement;

    if (draggedElement) {
        draggedElement.classList.add("avatar-fixed");
        ev.target.appendChild(draggedElement);

        if (ev.target.id === "dropzone") {
            selectedAvatar = ev.target.querySelector('img').id;
        }
    }
}

// --- Soporte táctil ---
let currentTouchElement = null;
let touchOffsetX = 0, touchOffsetY = 0;

function startDragTouch(e) {
    const event = e.type.includes('touch') ? e.touches[0] : e;
    currentTouchElement = e.target;
    touchOffsetX = event.clientX - currentTouchElement.getBoundingClientRect().left;
    touchOffsetY = event.clientY - currentTouchElement.getBoundingClientRect().top;
}

function moveTouch(e) {
    if (!currentTouchElement) return;
    const event = e.type.includes('touch') ? e.touches[0] : e;
    const x = event.clientX - touchOffsetX;
    const y = event.clientY - touchOffsetY;

    currentTouchElement.style.position = "absolute";
    currentTouchElement.style.left = `${x}px`;
    currentTouchElement.style.top = `${y}px`;
}

function endTouch(e) {
    if (currentTouchElement) {
        const dropzone = document.getElementById('dropzone');
        const dropzoneRect = dropzone.getBoundingClientRect();
        const touchX = e.changedTouches[0].clientX;
        const touchY = e.changedTouches[0].clientY;

        if (touchX >= dropzoneRect.left && touchX <= dropzoneRect.right &&
            touchY >= dropzoneRect.top && touchY <= dropzoneRect.bottom) {
            drop({ preventDefault: () => {}, target: dropzone });
        }
        currentTouchElement = null;
    }
}

// --- Eventos para escritorio ---
document.getElementById("avatar1").addEventListener("dragstart", drag);
document.getElementById("avatar2").addEventListener("dragstart", drag);
document.getElementById("dropzone").addEventListener("dragover", allowDrop);
document.getElementById("dropzone").addEventListener("drop", drop);

// --- Eventos táctiles ---
["avatar1", "avatar2"].forEach(id => {
    const avatar = document.getElementById(id);
    avatar.addEventListener('touchstart', startDragTouch);
    document.addEventListener('touchmove', moveTouch);
    document.addEventListener('touchend', endTouch);
});

// --- Selección del avatar ---
function selectAvatar() {
    if (selectedAvatar) {
        document.getElementById('pantallaAvatar').style.display = 'none';
        document.getElementById('pantallaUsuario').style.display = 'flex';
    } else {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "No elegiste ningún avatar"
        });
        resetAvatarSelection();
    }
}

// --- Resetear selección ---
function resetAvatarSelection() {
    selectedAvatar = null;
    ["avatar1", "avatar2"].forEach(id => {
        const avatar = document.getElementById(id);
        document.getElementById("avatares").appendChild(avatar);
    });
}


function ejecutarJuego(){
    document.getElementById('gameContainer').style.display = 'block';

    var player;
    var pacas;
    var gallinas;
    var bombs;
    var coyote;
    var jaulaEspecial;
    var huevo;
    var platforms;
    var cursors;
    var score = 0;
    var gameOver = false;
    var scoreText;
    var vidas;
    var musica;
    var musica2;
    
    class Lvl1 extends Phaser.Scene {
        constructor() {
            super({ key: 'Lvl1' });
        }
    
        preload() {
            this.load.image('sky1', 'media/bg1.png');
            this.load.image('ground1', 'media/plataforma1.png');
            this.load.image('floor1', 'media/floor1.png');
            this.load.image('paca', 'media/paca.png');
            this.load.image('bomb', 'media/bomb.png');
            this.load.image('3vida', 'media/vidas3.png');
            this.load.image('2vida', 'media/vidas2.png');
            this.load.image('1vida', 'media/vidas1.png');
            this.load.image('text', 'media/gameOver_txt.png'); //pantalla de game over
            this.load.image('btnVolver', 'media/backGmOv.png');
            this.load.image('soundPauseBtn', 'media/soundBtn.png');
            this.load.image('txtLvlUp', 'media/LvlUp.png');
            this.load.spritesheet('dude1', 'media/player1.png', { frameWidth: 46, frameHeight: 90 });
            this.load.spritesheet('dude2', 'media/player2.png', { frameWidth: 46, frameHeight: 90 });

            //sonidos
            this.load.audio('sound', 'media/lvl1Sound.mp3');
            this.load.audio('sound2', 'media/lvl2Sound.mp3');
            this.load.audio('item', 'media/itemLvl1.mp3');
            this.load.audio('GameOverSound', 'media/gameOverSound.mp3');
        }
    
        create() {
            musica = this.sound.add('sound');
            musica.play({ loop: true });

            vidas=3;
            // Fondo
            this.add.image(400, 300, 'sky1');

            let bgHeader = this.add.graphics();
            bgHeader.fillStyle(0xffffff, 0.5);
            bgHeader.fillRoundedRect(5, 5, 790, 50, 10); // (x, y, width, height, radius)

            // Nivel
            let nomLvl1 = this.add.text(16, 10, 'Nivel #1', {
                fontFamily: '"Jersey 10", sans-serif',
                fontSize: '30px',
                fill: '#000'
            });

            // Puntaje
            scoreText = this.add.text(216, 10, 'Score: ', {
                fontFamily: '"Jersey 10", sans-serif',
                fontSize: '30px',
                fill: '#000'
            });

            let today = new Date();
            fechaActual = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

            // fecha
            let fechaTexto = this.add.text(600, 10, ` ${fechaActual}`, {
                fontFamily: '"Jersey 10", sans-serif',
                fontSize: '30px',
                fill: '#000'
            });

            // Plataformas
            platforms = this.physics.add.staticGroup();
            platforms.create(400, 600, 'floor1');
            platforms.create(610, 430, 'ground1');
            platforms.create(50, 280, 'ground1');
            platforms.create(750, 260, 'ground1');
            //vidas
            img1Vidas=this.add.image(480,25,'1vida');
            img2Vidas=this.add.image(480,25,'2vida');
            img3Vidas=this.add.image(480,25,'3vida');


    
            if(selectedAvatar==="avatar1"){
                player = this.physics.add.sprite(300, 420, 'dude1');
                player.setBounce(0.2);
                player.setCollideWorldBounds(true);

                // Animaciones
                this.anims.create({
                    key: 'left',
                    frames: this.anims.generateFrameNumbers('dude1', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: -1
                });
        
                this.anims.create({
                    key: 'turn',
                    frames: [{ key: 'dude1', frame: 4 }],
                    frameRate: 20
                });
        
                this.anims.create({
                    key: 'right',
                    frames: this.anims.generateFrameNumbers('dude1', { start: 5, end: 8 }),
                    frameRate: 10,
                    repeat: -1
                });

            } else if(selectedAvatar==="avatar2"){
                player = this.physics.add.sprite(100, 420, 'dude2');
                player.setBounce(0.2);
                player.setCollideWorldBounds(true);

                // Animaciones
                this.anims.create({
                    key: 'left',
                    frames: this.anims.generateFrameNumbers('dude2', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: -1
                });
        
                this.anims.create({
                    key: 'turn',
                    frames: [{ key: 'dude2', frame: 4 }],
                    frameRate: 20
                });
        
                this.anims.create({
                    key: 'right',
                    frames: this.anims.generateFrameNumbers('dude2', { start: 5, end: 8 }),
                    frameRate: 10,
                    repeat: -1
                });
            }
            
            let bgBottom = this.add.graphics();
            bgBottom.fillStyle(0xffffff, 0.5);
            bgBottom.fillRoundedRect(10, 70, 290, 50, 10); // (x, y, width, height, radius)

            // nombre
            var nom=this.add.text(95, 80, nombre, { fontSize: '30px', fill: '#000', fontFamily: '"Jersey 10", sans-serif',});

            // Controles
            cursors = this.input.keyboard.createCursorKeys();
            cursors = this.input.keyboard.createCursorKeys();

            // Variables para los gestos
            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;

            // Detecta el inicio del toque
            this.input.on('pointerdown', (pointer) => {
                touchStartX = pointer.downX;
                touchStartY = pointer.downY;
            });

            // Detecta cuando termina el toque
            this.input.on('pointerup', (pointer) => {
                touchEndX = pointer.upX;
                touchEndY = pointer.upY;

                const swipeX = touchEndX - touchStartX;
                const swipeY = touchEndY - touchStartY;

                // Determinamos la dirección del swipe
                if (Math.abs(swipeX) > Math.abs(swipeY)) {
                    if (swipeX > 30) {
                        cursors.right.isDown = true;
                        cursors.left.isDown = false;
                    } else if (swipeX < -30) {
                        cursors.left.isDown = true;
                        cursors.right.isDown = false;
                    }
                } else {
                    if (swipeY > 30) {
                        cursors.down.isDown = true;
                        cursors.up.isDown = false;
                    } else if (swipeY < -30) {
                        cursors.up.isDown = true;
                        cursors.down.isDown = false;
                    }
                }

                // Resetea después del movimiento
                setTimeout(() => {
                    cursors.right.isDown = false;
                    cursors.left.isDown = false;
                    cursors.up.isDown = false;
                    cursors.down.isDown = false;
                }, 150);
            });

            // Pacas
            pacas = this.physics.add.group({
                key: 'paca',
                repeat: 11, //12 en total
                setXY: { x: 12, y: 0, stepX: 70 }
            });
    
            pacas.children.iterate(child => {
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            });
    
            // Bombas
            bombs = this.physics.add.group();
    
            // Colisiones
            this.physics.add.collider(player, platforms);
            this.physics.add.collider(pacas, platforms);
            this.physics.add.collider(bombs, platforms);
            this.physics.add.overlap(player, pacas, this.colectarPacas, null, this);
            this.physics.add.collider(player, bombs, (player, bomb) => {
                // Llama a la función hitBomb
                this.hitBomb(player, bomb);
                bomb.destroy();
            }, null, this);
        }
    
        update() {
            if(vidas==2){
                img3Vidas.destroy();
            }else if(vidas===1){
                img2Vidas.destroy();
            }else if(vidas===0){
                img1Vidas.destroy();
                gameOver=true;
            }
            if (gameOver && !this.hasHandledGameOver) {
                this.hasHandledGameOver = true; // para que no se llame muchas veces
                musica.pause();
                GameOver(this);
            }

            if(!gameOver){
                if (cursors.left.isDown) {
                    player.setVelocityX(-160);
                    player.anims.play('left', true);
                } else if (cursors.right.isDown) {
                    player.setVelocityX(160);
                    player.anims.play('right', true);
                } else {
                    player.setVelocityX(0);
                    player.anims.play('turn');
                }
        
                if (cursors.up.isDown && player.body.touching.down) {
                    player.setVelocityY(-330);
                }
            }

            let btnSound = this.add.image(760, 30, 'soundPauseBtn').setDepth(12).setInteractive();
        
            btnSound.on('pointerover', () => {
                btnSound.setScale(0.5); // Efecto al pasar el mouse
            });
        
            btnSound.on('pointerout', () => {
                btnSound.setScale(0.4); // Vuelve al tamaño normal
            });
        
            btnSound.on('pointerdown', () => {
                if(musica.isPlaying){
                    musica.pause();
                } else {
                    musica.resume();
                }
            });
        }
    
        colectarPacas(player, paca) {
            let sonidoPac = this.sound.add('item');
            sonidoPac.play();

            paca.disableBody(true, true);
    
            score += 10;
            scoreText.setText('Score: ' + score);
    
            if (pacas.countActive(true) === 0 && score<=470) {
                pacas.children.iterate(child => {
                    child.enableBody(true, child.x, 0, true, true);
                });
    
                var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;
                
            }
            if(score>=480){
                // llamada a pantalla de ganar
                musica.pause();
                LvlUp(this); // primero ejecutas la animación
                this.time.delayedCall(3500, () => {
                    this.scene.stop('Lvl1');
                    this.scene.start('Lvl2');
                });
            }
        }
    
        hitBomb(player) {
            vidas-=1;
        }
    } //lvl1
    
    class Lvl2 extends Phaser.Scene {
        constructor() {
            super({ key: 'Lvl2' });
        }
    
        preload() {
            this.load.image('sky2', 'media/bg2.png');
            this.load.image('ground2', 'media/plataforma2.png');
            this.load.image('miniGround', 'media/plataformaMini.png')
            this.load.image('floor2', 'media/floor2.png');
            this.load.image('gallina', 'media/paca.png');
            this.load.image('jaula', 'media/jaula.png');
            this.load.image('bomb', 'media/bomb.png');
            this.load.image('3vida', 'media/vidas3.png');
            this.load.image('2vida', 'media/vidas2.png');
            this.load.image('1vida', 'media/vidas1.png');
            this.load.image('text', 'media/gameOver_txt.png'); //pantalla de game over
            this.load.image('btnVolver', 'media/backGmOv.png');
            this.load.image('txtWin', 'media/youWin.png');
            this.load.image('huevo', 'media/huevo.png');
            this.load.image('soundPauseBtn', 'media/soundBtn.png');
            this.load.spritesheet('dude1', 'media/player1.png', { frameWidth: 46, frameHeight: 90 });
            this.load.spritesheet('dude2', 'media/player2.png', { frameWidth: 46, frameHeight: 90 });
            this.load.spritesheet('gallinita', 'media/gallina.png', { frameWidth: 40, frameHeight: 46 });
            this.load.spritesheet('coyote', 'media/coyote.png', { frameWidth: 95, frameHeight: 60 });

            //sonidos
            this.load.audio('sound2','media/lvl2Sound.mp3');
            this.load.audio('item2', 'media/itemLvl2.mp3');
            this.load.audio('specialItem', 'media/itemLvl2.mp3');
            this.load.audio('WinSound', 'media/winSound.mp3');
            this.load.audio('sonidoJaula', 'media/jaulaSound.mp3');
            this.load.audio('powerUp', 'media/powerUpSound.mp3');
        }
    
        create() {
            musica2 = this.sound.add('sound2');
            musica2.play({ loop: true })
            
            vidas=3;

            // Fondo
            this.add.image(400, 300, 'sky2');

            let bgHeader = this.add.graphics();
            bgHeader.fillStyle(0xffffff, 0.5);
            bgHeader.fillRoundedRect(5, 5, 790, 50, 10); // (x, y, width, height, radius)

            // Nivel
            let nomLvl2 = this.add.text(16, 10, 'Nivel #2', {
                fontFamily: '"Jersey 10", sans-serif',
                fontSize: '30px',
                fill: '#000'
            });

            // Puntaje
            scoreText = this.add.text(216, 10, 'Score: ', {
                fontFamily: '"Jersey 10", sans-serif',
                fontSize: '30px',
                fill: '#000'
            });

            let today = new Date();
            fechaActual = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

            // fecha
            let fechaTexto = this.add.text(600, 10, ` ${fechaActual}`, {
                fontFamily: '"Jersey 10", sans-serif',
                fontSize: '30px',
                fill: '#000'
            });
            
            // Plataformas
            platforms = this.physics.add.staticGroup();
            platforms.create(400, 600, 'floor2');
            platforms.create(400, 430, 'miniGround');
            platforms.create(440, 180, 'miniGround');
            platforms.create(20, 310, 'ground2');
            platforms.create(820, 280, 'ground2');

            // Vidas
            img1Vidas=this.add.image(480,25,'1vida');
            img2Vidas=this.add.image(480,25,'2vida');
            img3Vidas=this.add.image(480,25,'3vida');
        
            // Jugador
            if(selectedAvatar==="avatar1"){
                player = this.physics.add.sprite(200, 420, 'dude1');

            } else if(selectedAvatar==="avatar2"){
                player = this.physics.add.sprite(200, 420, 'dude2');
            }
  
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);

            let bgBottom = this.add.graphics();
            bgBottom.fillStyle(0xffffff, 0.5);
            bgBottom.fillRoundedRect(10, 70, 290, 50, 10); // (x, y, width, height, radius)

            // nombre
            var nom=this.add.text(95, 80, nombre, { fontSize: '30px', fill: '#000', fontFamily: '"Jersey 10", sans-serif',});

            // Controles
            cursors = this.input.keyboard.createCursorKeys();
            
            // Gallinas
            this.anims.create({
                key: 'walkGallina',
                frames: this.anims.generateFrameNumbers('gallinita', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
    
            gallinas = this.physics.add.group({
                key: 'gallinita',
                repeat: 9,
            });

            let xG=12; //posicion para la 1era gallina
            gallinas.children.iterate(child => {
                let separacion = Phaser.Math.Between(70, 100); //espacio random entre gallinas
                child.setX(xG);
                child.setY(0);
                xG+=separacion;

                child.setBounce(0.9);
                child.setCollideWorldBounds(true);
                child.setVelocityX(Phaser.Math.Between(100, 250));
                child.anims.play('walkGallina', true);
            });

            // Coyote
            this.anims.create({
                key: 'walkCoyote',
                frames: this.anims.generateFrameNumbers('coyote', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
            
            // para movimiento del coyote
            this.coyoteStartedFollowing = false;

            coyote = this.physics.add.sprite(100, 440, 'coyote');
            coyote.setBounce(0.2);
            coyote.setCollideWorldBounds(true);
            coyote.anims.play('walkCoyote');

            // Bombas
            bombs = this.physics.add.group();
        
            // Colisiones y overlap
            this.physics.add.collider(player, platforms);
            this.physics.add.collider(gallinas, platforms);
            this.physics.add.collider(coyote, platforms);
            this.physics.add.collider(bombs, platforms);
            this.physics.add.overlap(player, gallinas, this.colectarGallinas, null, this);
            this.coyoteOverlap = true;
            this.physics.add.overlap(coyote, gallinas, (coyote, gallina) => {
                if (this.coyoteOverlap) {
                    this.choqueCoyote(coyote, gallina);
                }
            }, null, this);
            this.physics.add.collider(player, bombs, (player, bomb) => {
                // Llama a la función hitBomb
                this.hitBomb(player, bomb);
                bomb.destroy();
            }, null, this);

            //da 2 seg de ventaja al jugador y luego empieza a seguir sus movimientos
            this.time.delayedCall(2000, () => {
                this.coyoteStartedFollowing = true;
            });

            // Recurso especial
            // Coordenadas posibles
            this.coord = [
                { x: 700, y: 520 },
                { x: 70, y: 520 },
                { x: 400, y: 355 },
                { x: 440, y: 105 },
                { x: 80, y: 235 },
                { x: 700, y: 205 }
            ];

            jaulaEspecial=null;
            let flagOverlap = false;
            let delayedDestroyEvent = null;

            // Evento que lanza jaula especial cada 20 segundos
            this.time.addEvent({
                delay: 20000,
                loop: true,
                callback: () => {
                    // Solo se lanza nueva jaula si no hay otra activa
                    if (jaulaEspecial === null) {
                        let index = Phaser.Math.Between(0, this.coord.length - 1);
                        let coords = this.coord[index];

                        jaulaEspecial = this.physics.add.image(coords.x, coords.y, 'jaula');
                        this.physics.add.collider(jaulaEspecial, platforms);

                        flagOverlap = false;

                        // Detectar si el jugador la toca
                        this.physics.add.overlap(player, jaulaEspecial, () => {
                            if (!flagOverlap) {
                                let sonidoJ= this.sound.add('sonidoJaula');
                                sonidoJ.play();

                                flagOverlap = true;

                                // Cancelar la destrucción automática si ocurre overlap
                                if (delayedDestroyEvent) {
                                    delayedDestroyEvent.remove();
                                    delayedDestroyEvent = null;
                                }
                                score += 100;

                                // Detener al coyote y meterlo en la jaula
                                coyote.setVelocity(0, 0);
                                coyote.body.moves = false;
                                coyote.setPosition(jaulaEspecial.x, jaulaEspecial.y);

                                // No puede capturar gallinas mientras esta atrapado
                                this.coyoteOverlap=false;

                                // Luego de 10 segundos liberar al coyote y reestablecer lo que puede hacer
                                this.time.delayedCall(10000, () => {
                                    coyote.body.moves = true;
                                    this.coyoteStartedFollowing = true;
                                    this.coyoteOverlap = true 
                                    if (jaulaEspecial) {
                                        jaulaEspecial.destroy();
                                        jaulaEspecial = null;
                                    }

                                    flagOverlap = false;
                                });
                            }
                        }, null, this);

                        // Si no hay overlap en 10 segundos, eliminar la jaula
                        delayedDestroyEvent = this.time.delayedCall(10000, () => {
                            if (!flagOverlap && jaulaEspecial) {
                                jaulaEspecial.destroy();
                                jaulaEspecial = null;
                            }
                        });
                    }
                }
            });

            huevo=null;
            let flagOverlapH = false;
            let delayedDestroyEventH = null;
            //para huevo
            this.time.addEvent({
                delay: 25000,
                loop: true,
                callback: () => {
                    // Solo se lanza nuevo huevo si no hay otro activo
                    if (huevo === null) {
                        let index = Phaser.Math.Between(0, this.coord.length - 1);
                        let coords = this.coord[index];

                        huevo = this.physics.add.image(coords.x, coords.y, 'huevo');
                        this.physics.add.collider(huevo, platforms);

                        flagOverlapH = false;

                        // Detectar si el jugador lo toca
                        this.physics.add.overlap(player, huevo, () => {
                            if (!flagOverlapH) {
                                let sonidoH= this.sound.add('powerUp');
                                sonidoH.play();
                                score += 150;
                                flagOverlapH = true;

                                // Cancelar la destrucción automática si ocurre overlap
                                if (delayedDestroyEventH) {
                                    delayedDestroyEventH.remove();
                                    delayedDestroyEventH = null;
                                }
                                

                                huevo.destroy();
                                huevo = null;
                            }
                        }, null, this);

                        // Si no hay overlap en 10 segundos, eliminar el huevo
                        delayedDestroyEventH = this.time.delayedCall(10000, () => {
                            if (!flagOverlapH && huevo) {
                                huevo.destroy();
                                huevo = null;
                            }
                        });
                    }
                }
            });
        }
        
        update() {
            if(vidas===2){
                img3Vidas.destroy();
            }else if(vidas===1){
                img2Vidas.destroy();
            }else if(vidas===0){
                img1Vidas.destroy();
                gameOver = true;
            }
            //si gana
            console.log(countGallinas);
            if(countGallinas>=4 && !this.hasHandledWin) {
                this.hasHandledWin = true;
                //pantalla de ganar
                musica2.pause();

                Win(this);
            }    

            //si pierde
            if (gameOver && !this.hasHandledGameOver) {
                this.hasHandledGameOver = true; // para que no se llame muchas veces
                musica2.pause();
                GameOver(this);
            }
        
            if (!gameOver) {
                //si no pierde
                //movimiento del jugador
                if (cursors.left.isDown) {
                    player.setVelocityX(-160);
                    player.anims.play('left', true);
                } else if (cursors.right.isDown) {
                    player.setVelocityX(160);
                    player.anims.play('right', true);
                } else {
                    player.setVelocityX(0);
                    player.anims.play('turn');
                }
        
                if (cursors.up.isDown && player.body.touching.down) {
                    player.setVelocityY(-330);
                }

                //para que al llegar al borde, las gallinas giren
                gallinas.children.iterate(child => {
                    if (child.body.velocity.x > 0) {
                        child.setFlipX(false);
                    } else {
                        child.setFlipX(true);
                    }
                });

                //movimiento del coyote
                if (this.coyoteStartedFollowing) {
                    coyote.setVelocityX((player.body.velocity.x)*2); //se mueve al doble de la velocidad del player
                
                    // Saltar si el jugador salta
                    if (coyote.body.touching.down && player.body.velocity.y < -200) {
                        coyote.setVelocityY(-330);
                    }
                
                    // Animación coyote
                    if (player.body.velocity.x < 0) {
                        coyote.anims.play('walkCoyote', true);
                        coyote.setFlipX(true);
                    } else if (player.body.velocity.x > 0) {
                        coyote.anims.play('walkCoyote', true);
                        coyote.setFlipX(false);
                    } else {
                        coyote.anims.stop();
                    }
                }             
            }

            let btnSound = this.add.image(760, 30, 'soundPauseBtn').setDepth(12).setInteractive();
        
            btnSound.on('pointerover', () => {
                btnSound.setScale(0.5); // Efecto al pasar el mouse
            });
        
            btnSound.on('pointerout', () => {
                btnSound.setScale(0.4); // Vuelve al tamaño normal
            });
        
            btnSound.on('pointerdown', () => {
                if(musica2.isPlaying){
                    musica2.pause();
                } else {
                    musica2.resume();
                }
            });
        }    
    
        colectarGallinas(player, gallina) {
            let sonidoGallina = this.sound.add('item2');
            sonidoGallina.play();

            gallina.disableBody(true, true);
    
            score += 10;
            scoreText.setText('Score: ' + score);
            if (gallinas.countActive(true) === 0 && countGallinas<4) {
                console.log("entro");
                countGallinas++;
                let xG=12;

                gallinas.children.iterate(child => {
                    let separacion = Phaser.Math.Between(70, 100);
                    child.enableBody(true, xG, 0, true, true);

                    let velocidadX = Phaser.Math.Between(100, 500);
                    if (Phaser.Math.Between(0, 1) === 0) velocidadX *= -1;
                    child.setVelocityX(velocidadX);

                    child.anims.play('walkGallina', true);

                    xG+=separacion;
                });

                var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;
            }         
        }
          
    
        choqueCoyote(coyote, gallina) {
            let sonidoGallina = this.sound.add('item2');
            sonidoGallina.play();

            gallina.disableBody(true, true);

            if (gallinas.countActive(true) === 0 && countGallinas<4) {
                let xG=12;
                countGallinas++;
                gallinas.children.iterate(child => {
                    let separacion = Phaser.Math.Between(70, 100);
                    child.enableBody(true, xG, 0, true, true);

                    let velocidadX = Phaser.Math.Between(100, 500);
                    if (Phaser.Math.Between(0, 1) === 0) velocidadX *= -1;
                    child.setVelocityX(velocidadX);

                    child.anims.play('walkGallina', true);

                    xG+=separacion;
                });

                var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;
            }
        }

        hitBomb(player) {
            vidas-=1;
        }

    } //lvl2

    var game; //global

    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'gameContainer',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: [Lvl1, Lvl2]
    };

    game = new Phaser.Game(config);

    function guardarScore() {
        let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
        let jugadorExistente = jugadores.find(item => item.usuario === nombre);
    
        if (jugadorExistente) {
            // Si el jugador existe, compara los puntajes y guarda el mayor
            if (score > jugadorExistente.score) {
                jugadorExistente.score = score; 
                jugadorExistente.fecha = fechaActual; 
            }
        } else {
            // si el jugador no existe, agrega el nuevo jugador a la lista
            jugadores.push({ usuario: nombre, score: score, fecha: fechaActual });
        }
    
        // Guarda la lista actualizada de jugadores en el localStorage
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
    }
    

    function GameOver(scene){
        scene.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        
        let musicaGO = scene.sound.add('GameOverSound');
        musicaGO.play();

        let overlay = scene.add.graphics().setDepth(10);
        overlay.fillStyle(0x000000, 0.5); // Color negro con opacidad
        overlay.fillRect(0, 0, scene.cameras.main.width, scene.cameras.main.height);
        // texto de game over
        let txt = scene.add.image(400, 300, 'text').setDepth(11);
    
        scene.tweens.add({
            targets: txt,
            y: 130,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        guardarScore();

        //boton de regresar
        let btnVolver = scene.add.image(400, 480, 'btnVolver').setDepth(12).setInteractive();
        btnVolver.setScale(0.4); // Puedes ajustar el tamaño si es necesario
    
        btnVolver.on('pointerover', () => {
            btnVolver.setScale(0.5); // Efecto al pasar el mouse
        });
    
        btnVolver.on('pointerout', () => {
            btnVolver.setScale(0.4); // Vuelve al tamaño normal
        });
    
        btnVolver.on('pointerdown', () => {
            musicaGO.pause();
            window.location.reload();  
        });
    }

    function LvlUp(scene){
        scene.physics.pause();
        let overlay = scene.add.graphics().setDepth(10);
        overlay.fillStyle(0x000000, 0.5); // Color negro con opacidad
        overlay.fillRect(0, 0, scene.cameras.main.width, scene.cameras.main.height);
        // texto de game over
        let txt = scene.add.image(400, 300, 'txtLvlUp').setDepth(11);
    
        scene.tweens.add({
            targets: txt,
            y: 130,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    function Win(scene){
        scene.physics.pause();

        let musicaW = scene.sound.add('WinSound');
        musicaW.play();

        let overlay = scene.add.graphics().setDepth(10);
        overlay.fillStyle(0x000000, 0.5); // Color negro con opacidad
        overlay.fillRect(0, 0, scene.cameras.main.width, scene.cameras.main.height);
        // texto de win
        let txt = scene.add.image(400, 300, 'txtWin').setDepth(11).setScale(0.6);
    
        scene.tweens.add({
            targets: txt,
            y: 130,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        guardarScore();

        //boton de regresar
        let btnVolver = scene.add.image(400, 480, 'btnVolver').setDepth(12).setInteractive();
        btnVolver.setScale(0.4); // Puedes ajustar el tamaño si es necesario
    
        btnVolver.on('pointerover', () => {
            btnVolver.setScale(0.5); // Efecto al pasar el mouse
        });
    
        btnVolver.on('pointerout', () => {
            btnVolver.setScale(0.4); // Vuelve al tamaño normal
        });
    
        btnVolver.on('pointerdown', () => {
            musicaW.pause();
            window.location.reload();  
        });
        
        let bgHeader = scene.add.graphics().setDepth(13);
        bgHeader.fillStyle(0xFFFFFF, 1);
        bgHeader.fillRoundedRect(10, 530, 780, 50, 10); // (x, y, width, height, radius)

        let felicitacion = scene.add.text(265, 540, '¡FELICIDADES '+nombre+'!', { fontFamily: '"Jersey 10", sans-serif',fontSize: '30px', fill: '#D6AE01' }).setDepth(14);
    }
}

function validarName() {
    nombre = document.getElementById("nombre").value;
    let regex = /^[a-zA-Z0-9_]{4,8}$/;

    if (regex.test(nombre)) {
        let scores = [];
        try {
            scores = JSON.parse(localStorage.getItem('jugadores')) || [];
        } catch (e) {
            console.error("Error al cargar los scores:", e);
            scores = [];
        }
        // Verifica si el nombre ya existe en la lista
        let nombreExistente = scores.some(item => item.usuario === nombre);
        if (!nombreExistente) {
            document.getElementById('pantallaUsuario').style.display = 'none';
            ejecutarJuego();
        } else {
            Swal.fire({
                icon: "success",
                title: "Usuario reconocido",
                text: "¡Bienvenido de nuevo!"
            }).then(() => {
                document.getElementById('pantallaUsuario').style.display = 'none';
                ejecutarJuego();// ejecuta hasta que le da clic
            });
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "El nombre debe tener entre 4 y 8 caracteres, solo letras, números o guiones bajos (_)."
        });
    }
}