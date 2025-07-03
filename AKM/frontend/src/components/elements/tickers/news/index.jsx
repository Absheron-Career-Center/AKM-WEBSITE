import React from 'react'
import NewsTickerIcon from '../../../../assets/svg/newspaper.svg'

const NewsTicker = () => {
    return (
        <div className="Ticker-Group Ticker-News">
            <img src={NewsTickerIcon} className='No-Select ' />
            <p>UNEC-də XVI Karyera Yarmarkası keçirilib 07.05.2025</p>
        </div>
    )
}

export default NewsTicker