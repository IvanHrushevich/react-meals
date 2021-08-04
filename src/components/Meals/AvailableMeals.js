import { useEffect, useState } from 'react';

import MealItem from './MealItem/MealItem';
import Card from '../UI/Card';

import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {
	const [meals, setMeals] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [httpError, setHttpError] = useState();

	useEffect(() => {
		setIsLoading(true);

		const fetchMeals = async () => {
			const response = await fetch(
				'https://react-meals-630db-default-rtdb.firebaseio.com/meals.json'
			);

			if (!response.ok) {
				throw new Error('Something went wrong');
			}

			const responseData = await response.json();

			const loadedMeals = Object.keys(responseData).reduce(
				(acc, mealName) => [
					...acc,
					{
						id: mealName,
						name: responseData[mealName].name,
						description: responseData[mealName].description,
						price: responseData[mealName].price,
					},
				],
				[]
			);

			setMeals(loadedMeals);
			setIsLoading(false);
		};

		fetchMeals().catch(error => {
			setIsLoading(false);
			setHttpError(error.message);
		});
	}, []);

	if (isLoading) {
		return (
			<section className={classes.MealsLoading}>
				<p>Loading...</p>
			</section>
		);
	}

	if (httpError) {
		return (
			<section className={classes.MealsError}>
				<p>{httpError}</p>
			</section>
		);
	}

	const mealsList = meals.map(meal => (
		<MealItem
			id={meal.id}
			key={meal.id}
			name={meal.name}
			description={meal.description}
			price={meal.price}
		/>
	));

	return (
		<section className={classes.meals}>
			<Card>
				<ul>{mealsList}</ul>
			</Card>
		</section>
	);
};

export default AvailableMeals;
