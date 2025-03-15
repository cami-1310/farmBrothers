var selectedAvatar;
let nombre;
let scores = [{ usuario: "", score: 0 }];
localStorage.setItem('scores', JSON.stringify(scores));
let img3Vidas;
let img2Vidas;
let img1Vidas;


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
    ev.dataTransfer.setData("text", ev.target.id); // Asigna el id del avatar al evento drag
}

function drop(ev) {
    ev.preventDefault();

    if (selectedAvatar!=null) {
        //si ya hay algo en el dropzone
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Ya elegiste un avatar"
        });
        return;
    }

    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data); // Obtiene el avatar arrastrado
    draggedElement.classList.add("avatar-fixed");
    ev.target.appendChild(draggedElement); // Mueve el avatar al dropzone

    // Verificamos qué avatar está dentro del dropzone
    if (ev.target.id === "dropzone") {
        selectedAvatar = ev.target.querySelector('img').id;
    }
}

// Colgando los eventos a las etiquetas
document.getElementById("avatar1").addEventListener("dragstart", drag);
document.getElementById("avatar2").addEventListener("dragstart", drag);
//puedan soltarse
document.getElementById("dropzone").addEventListener("dragover", allowDrop);
document.getElementById("dropzone").addEventListener("drop", drop);

//se elige el avatar
function selectAvatar(){
    if(selectedAvatar){
        if(selectedAvatar === "avatar1"){
            document.getElementById('pantallaAvatar').style.display = 'none';
            
        } else if (selectedAvatar === "avatar2"){
            document.getElementById('pantallaAvatar').style.display = 'none';
        }
        
        document.getElementById('pantallaAvatar').style.display = 'none';
        document.getElementById('pantallaUsuario').style.display = 'flex';
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "No elegiste ningun avatar"
        });

        resetAvatarSelection();
    }
}

// Función para resetear la pantalla si no eligio el avatar
function resetAvatarSelection() {
    selectedAvatar=null;
    // Vuelve a poner los avatares disponibles
    var avatar1 = document.getElementById("avatar1");
    var avatar2 = document.getElementById("avatar2");

    // Añade los avatares nuevamente al contenedor
    document.getElementById("avatares").appendChild(avatar1);
    document.getElementById("avatares").appendChild(avatar2);
}

function ejecutarJuego(){
    document.getElementById('gameContainer').style.display = 'block';

    var player;
    var pacas;
    var gallinas;
    var bombs;
    var coyote;
    var platforms;
    var cursors;
    var score = 0;
    var gameOver = false;
    var scoreText;
    var vidas=3;
    
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
            this.load.image('3vida', 'media/bomb.png');
            this.load.image('2vida', 'media/bomb.png');
            this.load.image('1vida', 'media/bomb.png');
            this.load.spritesheet('dude1', 'media/player1.png', { frameWidth: 46, frameHeight: 90 });
            this.load.spritesheet('dude2', 'media/player2.png', { frameWidth: 46, frameHeight: 90 });
        }
    
        create() {
            this.scene.stop('Lvl1');
            this.scene.start('Lvl2');

            // Fondo
            this.add.image(400, 300, 'sky1');
    
            // Puntaje
            scoreText = this.add.text(16, 0, 'score: ', { fontSize: '32px', fill: '#000' });
    
            // Plataformas
            platforms = this.physics.add.staticGroup();
            platforms.create(400, 600, 'floor1');
            platforms.create(610, 430, 'ground1');
            platforms.create(50, 280, 'ground1');
            platforms.create(750, 260, 'ground1');
    
            if(selectedAvatar==="avatar1"){
                player = this.physics.add.sprite(100, 420, 'dude1');
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
    
            // Controles
            cursors = this.input.keyboard.createCursorKeys();
    
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
            this.physics.add.collider(player, bombs, this.hitBomb, null, this);
        }
    
        update() {
            if (gameOver) return;
    
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
    
        colectarPacas(player, paca) {
            paca.disableBody(true, true);
    
            score += 10;
            scoreText.setText('Score: ' + score);
    
            if (pacas.countActive(true) === 0) {
                /*pacas.children.iterate(child => {
                    child.enableBody(true, child.x, 0, true, true);
                });
    
                var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;*/
                this.scene.stop('Lvl1');
                this.scene.start('Lvl2'); // Cambia a la escena del segundo nivel
            }
        }
    
        hitBomb(player) {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
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
            this.load.image('3vida', 'media/vidas3.png');
            this.load.image('2vida', 'media/vidas2.png');
            this.load.image('1vida', 'media/vidas1.png');
            this.load.image('text', 'media/gameOver_txt.png'); //pantalla de game over
            this.load.image('btnVolver', 'media/backGmOv.png');
            this.load.spritesheet('dude1', 'media/player1.png', { frameWidth: 46, frameHeight: 90 });
            this.load.spritesheet('dude2', 'media/player2.png', { frameWidth: 46, frameHeight: 90 });
            this.load.spritesheet('gallinita', 'media/gallina.png', { frameWidth: 40, frameHeight: 46 });
            this.load.spritesheet('coyote', 'media/coyote.png', { frameWidth: 95, frameHeight: 60 });
        }
    
        create() {
            gameOver = false; // Reinicia el estado del juego
            score = 0; // Reinicia el puntaje

            // Fondo
            this.add.image(400, 300, 'sky2');
        
            // Puntaje
            scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        
            // Plataformas
            platforms = this.physics.add.staticGroup();
            platforms.create(400, 600, 'floor2');
            platforms.create(400, 430, 'miniGround');
            platforms.create(440, 180, 'miniGround');
            platforms.create(20, 310, 'ground2');
            platforms.create(820, 280, 'ground2');

            //vidas
            img1Vidas=this.add.image(300,10,'3vida');
            img2Vidas=this.add.image(300,10,'2vida');
            img3Vidas=this.add.image(300,10,'1vida');
        
            if(selectedAvatar==="avatar1"){
                player = this.physics.add.sprite(200, 420, 'dude1');

            } else if(selectedAvatar==="avatar2"){
                player = this.physics.add.sprite(200, 420, 'dude2');
            }

            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            
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

            // coyote
            this.anims.create({
                key: 'walkCoyote',
                frames: this.anims.generateFrameNumbers('coyote', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
            
            //para movimiento del coyote
            this.coyoteStartedFollowing = false;

            coyote = this.physics.add.sprite(100, 440, 'coyote');
            coyote.setBounce(0.2);
            coyote.setCollideWorldBounds(true);
            coyote.anims.play('walkCoyote');
        
            // Colisiones
            this.physics.add.collider(player, platforms);
            this.physics.add.collider(gallinas, platforms);
            this.physics.add.collider(coyote, platforms);
            this.physics.add.collider(player, coyote, this.choqueCoyote, null, this);
            this.physics.add.overlap(player, gallinas, this.colectarGallinas, null, this);

            //da 2 seg de ventaja al jugador y luego empieza a seguir sus movimientos
            this.time.delayedCall(5000, () => {
                this.coyoteStartedFollowing = true;
            });
        }
        
        update() {
            //si pierde
            if (gameOver && !this.hasHandledGameOver) {
                this.hasHandledGameOver = true; // para que no se llame muchas veces
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
        }    
    
        colectarGallinas(player, gallina) {
            gallina.disableBody(true, true);
    
            score += 10;
            scoreText.setText('Score: ' + score);
    
            if (gallinas.countActive(true) === 0) {
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
            }
        }
    
        choqueCoyote(player) {
            vidas-=1;
            if(vidas===0) gameOver = true;
            if(vidas==2){
                img3Vidas.destroy();
            }else if(vidas===1){
                img2Vidas.destroy();
            }else if(vidas===0){
                img1Vidas.destroy();
            }

            player.setTint(0xff0000);
            this.tweens.add({
                targets: player,
                alpha: 0,
                ease: 'Linear',
                duration: 100,
                repeat: 3,
                yoyo: true,
                onComplete: () => {
                    player.clearTint(); // Quita el rojo
                    player.setAlpha(1); // Asegura que quede visible
                }
            });
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

    function guardarScore(){
        let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
        console.log(nombre,"-",score);

        // Agregamos el nuevo jugador a la lista
        jugadores.push({ usuario: nombre, score: score });

        // Guardamos la lista actualizada en el localStorage
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
    }

    function GameOver(scene){
        scene.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;

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
            window.location.reload();  
        });
    }
}

function validarName() {
    nombre = document.getElementById("nombre").value;
    let regex = /^[a-zA-Z0-9_]{4,8}$/;

    if (regex.test(nombre)) {
        let scores = JSON.parse(localStorage.getItem('scores')) || [];

        // Verifica si el nombre ya existe en la lista
        let nombreExistente = scores.some(item => item.usuario === nombre);

        if (!nombreExistente) {
            Swal.fire({
                icon: "success",
                title: "nombre registrado",
                text: "continuar al juego"
            });
            document.getElementById('pantallaUsuario').style.display = 'none';
            ejecutarJuego();
        } else {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "El nombre ya existe. Por favor, elige otro."
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