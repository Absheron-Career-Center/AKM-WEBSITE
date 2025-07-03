import React from 'react'
import CallTickerIcon from '../../../../assets/svg/phone.arrow.up.right.svg'

const CallTicker = () => {
    return (
        <div className="Ticker-Group Ticker-Call">
            <img src={CallTickerIcon} className="No-Select"/>
            <a href="tel:+994102322150" className="Call-Link">
                (+994 10) 232-21-50
            </a>
        </div>
    )
}

export default CallTicker
