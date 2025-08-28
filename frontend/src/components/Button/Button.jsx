import React from 'react';

const Button = ({ name, color = '#ff7194', borderRadius ='0', className }) => {
  const styles = {
    backgroundColor: color,
    color: 'white',
    padding: '18px 25px',
    borderRadius: 'borderRadius',
    cursor: 'pointer',
    border: 'none',
    textTransform: 'uppercase',
    fontSize: '15px',
    fontWeight: 500,
    marginTop: '10px',
    letterSpacing: '1px',
    fontFamily: "Alexandria, sans-serif",
  };

  return (
    <button style={styles} className={className}>
      {name}
    </button>
  );
};

export default Button;