import React from 'react'
import './DescriptionBox.css'
const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
        An e-commerce platform for clothing offers a convenient and diverse shopping experience, providing customers access to a wide range of apparel for men, women, and children. From casual wear to formal outfits, customers can explore numerous styles, sizes, and brands all from the comfort of their homes.
        </p>
        <p>
        These platforms often offer competitive pricing, discounts, and loyalty programs, ensuring affordability while maintaining quality. Additionally, fast shipping options and responsive customer service provide a reliable and hassle-free shopping journey, making online clothing stores a preferred choice for fashion enthusiasts.
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox
