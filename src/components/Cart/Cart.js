import { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartContext from '../../store/cart-context';

import classes from './Cart.module.css';
import CartItem from './CartItem';
import Checkout from './Checkout';

const Cart = props => {
	const cartContext = useContext(CartContext);
	const [isCheckout, setIsCheckout] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [didSubmit, setDidSubmit] = useState(false);

	const totalAmount = `$${cartContext.totalAmount.toFixed(2)}`;
	const hasItems = cartContext.items.length > 0;

	const cartItemRemoveHandler = id => {
		cartContext.removeItem(id);
	};
	const cartItemAddHandler = item => {
		cartContext.addItem({ ...item, amount: 1 });
	};
	const orderHandler = () => {
		setIsCheckout(true);
	};
	const submitOrderHandler = async userData => {
		setIsSubmitting(true);

		await fetch(
			'https://react-meals-630db-default-rtdb.firebaseio.com/orders.json',
			{
				method: 'POST',
				body: JSON.stringify({
					user: userData,
					orderedItems: cartContext.items,
				}),
			}
		);

		setIsSubmitting(false);
		setDidSubmit(true);
		cartContext.clearCart();
	};

	const cartItems = (
		<ul className={classes['cart-items']}>
			{cartContext.items.map(item => (
				<CartItem
					key={item.id}
					name={item.name}
					amount={item.amount}
					price={item.price}
					onRemove={cartItemRemoveHandler.bind(null, item.id)}
					onAdd={cartItemAddHandler.bind(null, item)}
				/>
			))}
		</ul>
	);

	const modalActions = (
		<div className={classes.actions}>
			<button className={classes['button--alt']} onClick={props.onClose}>
				Close
			</button>
			{hasItems && (
				<button className={classes.button} onClick={orderHandler}>
					Order
				</button>
			)}
		</div>
	);

	const cartModalContent = (
		<>
			{cartItems}
			<div className={classes.total}>
				<span>Total Amount</span>
				<span>{totalAmount}</span>
			</div>
			{isCheckout && (
				<Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
			)}
			{!isCheckout && modalActions}
		</>
	);

	const isSubmittingModalContent = <p>Sending order data...</p>;
	const didSubmitModalContent = (
		<>
			<p>Successfully sent the order!</p>
			<div className={classes.actions}>
				<button className={classes.button} onClick={props.onClose}>
					Close
				</button>
			</div>
		</>
	);

	return (
		<Modal onClose={props.onClose}>
			{!isSubmitting && !didSubmit && cartModalContent}
			{isSubmitting && isSubmittingModalContent}
			{!isSubmitting && didSubmit && didSubmitModalContent}
		</Modal>
	);
};

export default Cart;
