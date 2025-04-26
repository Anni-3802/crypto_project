import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/news');
        setNews(response.data.news.slice(0, 10) || []);
      } catch (error) {
        if (error.response?.status === 429) {
          setError('Too many requests. Please try again later or check API limits.');
        } else {
          setError('Failed to fetch news');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4">Crypto News</h1>
      {news.length === 0 ? (
        <Alert variant="info">No news available.</Alert>
      ) : (
        news.map((article, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{article.title}</Card.Title>
              <Card.Text>{article.description || 'No description available'}</Card.Text>
              <Card.Link href={article.url || '#'} target="_blank">Read More</Card.Link>
              <Card.Footer className="text-muted">
                {article.published_on ? new Date(article.published_on).toLocaleDateString() : 'Unknown date'} - {article.source || 'Unknown'}
              </Card.Footer>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default News;