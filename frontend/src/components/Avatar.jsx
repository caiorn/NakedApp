import React from 'react'

export function Avatar({ src, alt }) {
	const styles = {
		img: {
			width: '30px',
			height: '30px',
			borderRadius: '50%',
			objectFit: 'cover',
			border: '1px solid #ddd',
			boxShadow: '5px 10px 30px rgba(0, 0, 0, 0.1)',
			margin: '10px 5px 0px 5px', // top, right, bottom, left
			cursor: 'pointer',
		}
	}

	return <img style={styles.img} src={src} alt={alt} />
}
