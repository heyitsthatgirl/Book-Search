
const styles = {
    display: "grid",
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
}
export default function CardColumns({ children }) {
    return (
        <div style={styles}>
            {children}
        </div>
    )
}
