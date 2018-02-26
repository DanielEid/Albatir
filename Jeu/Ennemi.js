class Ennemi {
    constructor(posX, posY, typeE,taille,vitesse,pv, degat) {
        this.posX = posX;
        this.posY= posY;
        this.vitesse=vitesse; //vitesse maximale
        this.vitesseX=this.randomVitesseX(2);
        this.vitesseY=vitesse;
        this.pv=pv;
        this.degat = degat;
        this.typeE = typeE;
        this.taille=taille;
        this.img=new Image();

    }

    draw(ctx) {
        ctx.save();

        /*ctx.fillStyle = "grey";
        ctx.fillRect(this.posX, this.posY, this.taille, this.taille);*/

        ctx.drawImage(this.img,this.posX,this.posY);
        ctx.fillStyle = "white";
        ctx.fillText(this.pv,(this.posX+this.taille/6),(this.posY-this.taille/4),this.taille);
        ctx.restore();
    }

    randomVitesseX(ratioVitesse) {
        let signe = Math.random();
        if (signe < 0.5) {
            return -ratioVitesse * Math.random();
        }
        else {
            return ratioVitesse * Math.random();
        }
    }

    actionsEnnemi(ctx,w,h,player){  //differentes actions effectuées dans la boucle d'animation
        this.draw(ctx);
        this.move(ctx);
        this.testCollisionZone(w,h);

        if (this instanceof EnnemiLeger){
            this.retirerPvJoueurQuandEnnemiTouche(player);
            this.killEnnemiEtPvMoinsJoueur(h,player)
        }
        else if (this instanceof EnnemiLourd){
            this.followPlayer(player);
            this.retirerPvJoueurQuandEnnemiTouche(player);
            this.killEnnemiEtPvMoinsJoueur(h,player)

        }
    }

    move() {
        this.posX += this.vitesseX;
        this.posY += this.vitesseY;
    }



    testCollisionZone(w, h) {
        if ((this.posX + this.taille) > w) {
            this.inverseSensDeplacementX();
        }
        if (this.posX < 0) {
            this.inverseSensDeplacementX();
        }

        /*if ((this.posY ) > h) {
        }*/

        if (this.posY < 0-this.taille) {
            this.inverseSensDeplacementY();
        }
    }
    inverseSensDeplacementX() {
        this.vitesseX = -this.vitesseX;
    }

    inverseSensDeplacementY() {
        this.vitesseY = -this.vitesseY;
    }

    followPlayer(player){} //utilisée que pour l'ennemi lourd

    touched(player) {
        return ((this.posX <= player.posX && (player.posX <= (this.posX + this.taille)) || (player.posX + player.height) >= this.posX && player.posX <= (this.posX + this.taille))) && ((this.posY <= player.posY && (player.posY <= (this.posY + this.taille)) || (player.posY + player.width) >= this.posY && player.posY <= (this.posY + this.taille)));

    }

    retirerPvJoueurQuandEnnemiTouche(player){
        if(this.touched(player)) {
            this.pv=0;
            if(!player.invincible){
                player.retirerPvJoueur(this.degat/2);
            }
        }
    }

    retirerPvEnnemi(nbr){
        this.pv -= nbr;
    }

    /*
    *killEnnemiEtPvMoinsJoueur
    * ne tue pas réelement l'ennemi,
    * met ses pv a 0 donc sera tuer lors de l'appel de l'animation
    * et baisse les pv du joueur,
    * cette methode est appelée dans actionEnnemi
    * et effectue une action de verification de zone que ne fais pas
    * testColissionZone
     */
    killEnnemiEtPvMoinsJoueur(h,player){
        if (this.EnnemiEnDehorsCadre(h)) {
            this.pv = 0;
            if(!player.invincible){
                player.retirerPvJoueur(this.degat);
            }
        }
    }

    EnnemiEnDehorsCadre(h){
        return (this.posY) > h;
    }

}

class EnnemiLeger extends Ennemi{
    constructor(posX, posY,typeE,taille,vitesse){
        super(posX, posY,typeE,taille,vitesse,50, 20);
        this.img.src='../ressources/spaceShipEnnemiLeger.png';
    }


}

class EnnemiLourd extends Ennemi{
    constructor(posX, posY,typeE,taille,vitesse){
        super(posX, posY,typeE,taille,vitesse/1.5,100,40);    //vitesse 50% fois plus lente que leger
        this.img.src='../ressources/spaceShipEnnemiLourd.png';
    }

    followPlayer(player){
        if(this.posX<player.posX){
            this.vitesseX=this.vitesse;
        }
        else if(this.posX>player.posX){
            this.vitesseX=-this.vitesse;
        }
        else if(this.posX=player.posX){
            this.vitesseX=0;
        }
    }

}