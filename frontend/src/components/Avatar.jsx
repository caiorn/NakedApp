import React from 'react'

export function Avatar({ src, alt }) {
	const styles = {
		img: {
			width: '30px',
			height: '30px',
			borderRadius: '50%',
			objectFit: 'cover',
			border: '2px solid #ddd',
			marginLeft: '5px'
		}
	}

	return <img style={styles.img} src={src} alt={alt} />
}
