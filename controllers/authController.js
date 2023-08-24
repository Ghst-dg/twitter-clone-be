const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.registerUser = async (req, res) => {

	try 
	{
		const { name, email, password } = req.body;
		const existingUser = await User.findOne({ email });
    
		if (existingUser) 
		{
			return res.status(409).json({ message: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({ name, email, password: hashedPassword });
		await newUser.save();
		res.status(201).json({ message: 'User registered successfully' });
	} 

	catch (error) 
	{
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}

};

exports.loginUser = async (req, res) => {

	try 
	{
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) 
		{
			return res.status(404).json({ message: 'User not found' });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) 
		{
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const token = jwt.sign({ userId: user._id }, 'test', {
			expiresIn: '1h',
		});
    res.status(200).json({ token });
	} 

	catch (error) 
	{
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}

};