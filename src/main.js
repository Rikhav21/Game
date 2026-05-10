import './style.css'
import Phaser from 'phaser'
const config = {
  type:Phaser.WEBGL,
  width:500,
  height:500,
  canvas: document.getElementById('gameCanvas')
}

new Phaser.Game(config)