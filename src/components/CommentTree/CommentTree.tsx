import { ICommentTree } from '../../utilita/modelCommentTree'

// Рекурсивный компонент для отображения дерева комментариев
export const CommentTree: React.FC<{
  comment: ICommentTree
  depth?: number
}> = ({ comment, depth = 0 }) => {
  const marginLeft = depth * 20 // Отступ для вложенности

  return (
    <div className="comment" style={{ marginLeft: `${marginLeft}px` }}>
      <div className="comment-header">
        <span className="comment-author">{comment.user.email}</span>
        <span className="comment-date">
          {/* {new Date(comment.createdAt).toLocaleDateString()} */}
          {Date.now()}
        </span>
      </div>

      <div className="comment-content">{comment.content}</div>

      {/* Рекурсивно рендерим ответы */}
      {comment.related && comment.related.length > 0 && (
        <div className="related">
          {comment.related.map((relate) => (
            <CommentTree
              key={relate!._id}
              comment={relate!}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
