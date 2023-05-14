import { Container } from 'react-bootstrap';

export default function Jumbotron({ fluid, className, children }) {
    return (
        <Container fluid={fluid} className={className}>
            {children}
        </Container>
    )
}
