import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase.init';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';


const auth = getAuth(app);
function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  }
  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  }
  const handleRegisteredChange = event => {
    setRegistered(event.target.checked);
  }
  const handleSubmitForm = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {

      event.stopPropagation();
      return;
    }
    if (!/(?=.*\d)/.test(password)) {
      setError('Password should contain at least 1 digit');
      return;
    }

    setValidated(true);
    setError('');

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          console.log(error);
          setError(error.message);
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPassword('');
          verifyEmail();
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        })
    }

    event.preventDefault();
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email verification sent!')
      })
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('email send');
      })
  }

  return (
    <div className="App">
      <div className="registration w-50 mx-auto mt-3">
        <h2 className='text-primary'>{registered ? 'Log In' : 'Register'}</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmitForm}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />

            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>

            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>

          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered?" />
          </Form.Group>
          <p className='text-danger'>{error}</p>
          {/* Forget Password */}
          <Button onClick={handlePasswordReset} variant="link">Forgot Password?</Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? 'Log In' : 'Register'}
          </Button>
        </Form>

      </div>

    </div>
  );
}

export default App;
