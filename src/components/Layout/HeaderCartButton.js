import { useContext, useEffect, useState } from 'react';

import CartIcon from '../Cart/CartIcon';
import CartContext from '../../store/cart-context';
import classes from './HeaderCartButton.module.css';

const HeaderCartButton = props => {
	const [btnIsHighLighted, setBtnIsHighLighted] = useState(false);
	const cartContext = useContext(CartContext);

	const { items } = cartContext;

	const numberOfCartItems = items.reduce((acc, item) => acc + item.amount, 0);

	const btnClasses = `${classes.button} ${
		btnIsHighLighted ? classes.bump : ''
	}`;

	useEffect(() => {
		if (items.length === 0) {
			return;
		}

		const timer = setBtnIsHighLighted(true);

		setTimeout(() => {
			setBtnIsHighLighted(false);
		}, 300);

		return () => {
			clearTimeout(timer);
		};
	}, [items]);

	return (
		<button className={btnClasses} onClick={props.onClick}>
			<span className={classes.icon}>
				<CartIcon />
			</span>
			<span>Your Cart</span>
			<span className={classes.badge}>{numberOfCartItems}</span>
		</button>
	);
};

export default HeaderCartButton;
