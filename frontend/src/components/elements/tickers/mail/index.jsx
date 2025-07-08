import React from 'react'
import MailTickerIcon from '../../../../assets/svg/envelope.svg'
const MailTicker = () => {
    return (
        <div className="Ticker-Group Ticker-Mail">
            <img src={MailTickerIcon} className="No-Select"/>
            <a href="mailto:cv@absheronport.az" className="Ticker-Link">
                cv@absheronport.az
            </a>
        </div>
    )
}

export default MailTicker
