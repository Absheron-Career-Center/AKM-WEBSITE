import React, { useState, useEffect } from 'react';
// Images
import Header1Img from '../../../assets/image/header/IMG_5499.jpg';
import Header2Img from '../../../assets/image/header/DJI_0061.JPG';
import Header3Img from '../../../assets/image/header/IMG_5489.jpg';
import Header4Img from '../../../assets/image/header/IMG_5563.jpg';
import Header5Img from '../../../assets/image/header/IMG_5603-2.jpg';
import Header6Img from '../../../assets/image/header/IMG_5716.jpg';

// Icons
import ChevronCircleLeftUnactiveImg from '../../../assets/svg/chevron.circle.left.unactive.svg';
import ChevronCircleLeftActiveImg from '../../../assets/svg/chevron.circle.left.active.svg';
import ChevronCircleRightUnactiveImg from '../../../assets/svg/chevron.circle.right.unactive.svg';
import ChevronCircleRightActiveImg from '../../../assets/svg/chevron.circle.right.active.svg';

const Header = () => {
    const images = [
        Header1Img,
        Header2Img,
        Header3Img,
        Header4Img,
        Header5Img,
        Header6Img
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                goToNext();
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [currentIndex, isHovered]);

    const goToPrev = () => {
        setCurrentIndex(prevIndex =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex(prevIndex =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToImage = (index) => {
        setCurrentIndex(index);
    };

    const isAtStart = currentIndex === 0;
    const isAtEnd = currentIndex === images.length - 1;

    return (
        <div className="Header-Group ">
            <div
                className="Header-Section "
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
            
                <div className="header-carousel ">
                    <img
                        src={images[currentIndex]}
                        alt={`Header ${currentIndex + 1}`}
                        className="header-image "
                    />
              <div className="Main-Outline"></div>


                    <div className="nav-left">
                        {isAtStart ? (
                            <img
                                src={ChevronCircleLeftUnactiveImg}
                                alt="Previous (disabled)"
                                className="nav-icon"
                            />
                        ) : (
                            <button onClick={goToPrev} className="nav-button">
                                <img
                                    src={ChevronCircleLeftActiveImg}
                                    alt="Previous"
                                    className="nav-icon"
                                />
                            </button>
                        )}
                    </div>

                    <div className="nav-right">
                        {isAtEnd ? (
                            <img
                                src={ChevronCircleRightUnactiveImg}
                                alt="Next (disabled)"
                                className="nav-icon"
                            />
                        ) : (
                            <button onClick={goToNext} className="nav-button">
                                <img
                                    src={ChevronCircleRightActiveImg}
                                    alt="Next"
                                    className="nav-icon"
                                />
                            </button>
                        )}
                    </div>

                    <div className="dots-container">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => goToImage(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;