import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Container, Row, Col, Button, Form, Alert, Card } from 'react-bootstrap';
import './App.css';

const logo = require("./assets/imgs/abyss-title.png");

const Border = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const borderColor = `rgba(${255 - (0.05 * scrollY) % 255}, ${((0.05 * scrollY) % 255)}, ${255 - (0.05 * scrollY) % 255}, 0.22)`;

  return <div className="border-overlay" style={{ borderColor }}></div>;
};

const Background = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const backgroundColor = `rgba(${(scrollY / 20) % 255}, ${255 - ((scrollY / 20) % 255)}, ${(scrollY / 20) % 255}, 0.1)`;

  return <div className="background" style={{ backgroundColor }}></div>;
};

function Registration({ handleRegister, username, setUsername, password, setPassword, registrationError, inup, toggleInup }) {
  return (
    <Container>
      <Card className="card p-3 bg-dark text-white border-warning my-5">
        <h1>Register</h1>
        {registrationError && <Alert variant="danger">{registrationError}</Alert>}
        <Form onSubmit={handleRegister}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="warning" type="submit" className="mt-3">
            Register
          </Button>
        </Form>
        <Button variant="primary" onClick={toggleInup} className="m-3 " style={{ maxWidth: "200px" }}>
          {inup ? 'Registered? Login' : 'No account? Register'}
        </Button>
      </Card>
    </Container>
  );
}

function Login({ handleLogin, username, setUsername, password, setPassword, inup, toggleInup }) {
  return (
    <Container>
      <Card className="p-3 bg-dark text-white border-warning my-5">
        <h1>Login</h1>
        <Form>
          <Form.Group controlId="formUsername">
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="warning" onClick={handleLogin} className="mt-3">
            Login
          </Button>
        </Form>
        <Button variant="primary" onClick={toggleInup} className="m-3 " style={{ maxWidth: "200px" }}>
          {inup ? 'Registered? Login' : 'No account? Register'}
        </Button>
      </Card>
    </Container>
  );
}

function ArticleList({ articles, handleDelete, isAdmin }) {
  return (
    <Container id='article-list' className='p-2 pt-0'>
      <Row className='d-flex flex-col justify-content-center'>
        {articles.map(article => (
          <Col className={"p-1 my-5 col-" + (Math.ceil((Math.random() * 4) + 2)) + " p-3 mx-" + (1 + Math.floor(Math.random() * 3))} style={{ minWidth: "200px" }}>
            <div className=''>
              <div style={{ height: "300px" }}></div>
              <Card className={"cards p-3 my-" + (2 + Math.floor(Math.random() * 4)) + " bg-dark text-white border-warning " + "mr-" + (2 + Math.floor(Math.random() * 3))} style={{ minWidth: "200px", transform: "translateY(" + ((Math.random() * 200) - 100) + "px)" }}>
                <h3>{article.title}</h3>
                <p>{article.content}</p>
                {isAdmin && <Button variant="danger" onClick={() => handleDelete(article.id)}>Delete</Button>}
              </Card></div>

          </Col>


        ))}
      </Row>
    </Container>
  );
}
function ArticleForm({ newArticleTitle, newArticleContent, handleTitleChange, handleContentChange, handleSubmit, isAdmin }) {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://abyss-react-amber.vercel.app/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Image uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    isAdmin && (
      <Container>
        <Card className="p-3 bg-dark text-white border-warning mb-5">
          <h2>Add New Article:</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formArticleTitle">
              <Form.Label>Title:</Form.Label>
              <Form.Control type="text" value={newArticleTitle} onChange={handleTitleChange} />
            </Form.Group>
            <Form.Group controlId="formArticleContent" className="mt-3">
              <Form.Label>Content:</Form.Label>
              <Form.Control as="textarea" value={newArticleContent} onChange={handleContentChange} />
            </Form.Group>
            <Form.Group controlId="formArticleImage" className="mt-3">
              <Form.Label>Image:</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
            <Button variant="warning" type="submit" className="mt-3">
              Submit
            </Button>
            <Button variant="info" onClick={handleImageUpload} className="mt-3 ml-3">
              Upload Image
            </Button>
          </Form>
        </Card>
      </Container>
    )
  );
}


function App() {
  const [articles, setArticles] = useState([]);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [inup, setInup] = useState(true);
  const [logged, setLogged] = useState(false);

  const toggleInup = () => {
    setInup(!inup);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://abyss-react-amber.vercel.app/api/register', {
        username,
        password,
      });
      console.log('User registered successfully:', response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setRegistrationError(error.response.data.error);
      } else {
        setRegistrationError('An error occurred during registration.');
      }
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://abyss-react-amber.vercel.app/api/login', {
        username,
        password,
      });
      setToken(response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      setIsAdmin(decodedToken.isAdmin);
      setLogged(true);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    setToken('');
    setIsAdmin(false);
  };

  useEffect(() => {
    axios.get('http://abyss-react-amber.vercel.app/api/articles')
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });
  }, []);

  const handleTitleChange = (event) => {
    setNewArticleTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setNewArticleContent(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://abyss-react-amber.vercel.app/api/articles', {
      title: newArticleTitle,
      content: newArticleContent
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setArticles([...articles, response.data]);
        setNewArticleTitle('');
        setNewArticleContent('');
      })
      .catch(error => {
        console.error('Error creating article:', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://abyss-react-amber.vercel.app/api/articles/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setArticles(articles.filter(article => article.id !== id));
      })
      .catch(error => {
        console.error('Error deleting article:', error);
      });
  };

  return (
    <Container className='d-flex flex-column align-items-left'>
      <Background className="" />
      <Border />
      <img src={logo} className='p-5 m-5' style={{ filter: "invert()" }}></img>
      <ArticleList articles={articles} handleDelete={handleDelete} isAdmin={isAdmin} />


      {token ? (
        <div>
          <h1 className="text-warning">Welcome, {username}!</h1>
          <Button className='m-5' variant="dark" onClick={handleLogout}>Logout</Button>
        </div>
      ) : inup ? (
        <Registration
          handleRegister={handleRegister}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          registrationError={registrationError}
          inup={inup}
          toggleInup={toggleInup}
        />
      ) : <Login
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        inup={inup}
        toggleInup={toggleInup}
      />}

      <ArticleForm
        newArticleTitle={newArticleTitle}
        newArticleContent={newArticleContent}
        handleTitleChange={handleTitleChange}
        handleContentChange={handleContentChange}
        handleSubmit={handleSubmit}
        isAdmin={isAdmin}
      />
    </Container>
  );
}

export default App;
