import React from "react";
import minecraftHeart from '../assets/svg/heart.svg';

function MinecraftEasterEgg(props) {
    return (
        <div className="minecraft-easter-egg">
            <h5><img className="minecraft-heart" src={minecraftHeart} alt="heart"/> minecraft</h5>
            <div className="enderman">
                <div className="head">
                    <div className="front">
                        <span className="left-eye"/>
                        <span className="right-eye"/>
                    </div>
                    <div className="bottom"/>
                    <div className="left"/>
                    <div className="right"/>
                </div>
                <div className="mouth"/>
                <div className="enderman-body"/>
                <div className="left-arm"/>
                <div className="right-arm"/>
                <div className="left-leg"/>
                <div className="right-leg"/>

                <ul className="ender-dust">
                    <li className="particle"/>
                    <li className="particle"/>
                    <li className="particle"/>
                    <li className="particle"/>
                    <li className="particle"/>
                    <li className="particle"/>
                    <li className="particle"/>
                    <li className="particle"/>
                </ul>
            </div>
            <p className="credit">credit: <a href="https://codepen.io/icutpeople/pen/Iyrej">animation</a> by icutpeople</p>
        </div>
    );
}

export {MinecraftEasterEgg};