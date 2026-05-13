export default function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <table className="table table-striped">
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c}>
                <div className="placeholder-glow">
                  <span className="placeholder col-8"></span>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
