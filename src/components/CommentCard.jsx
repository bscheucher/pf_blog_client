import React from "react";
import { formatDate } from "../services/formatDate";

function CommentCard({ comment }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <p className="card-text">{comment.content}</p>
        <p className="card-text">
          <small className="text-muted">
            Author: {comment.username}
          </small>
        </p>
        <p className="card-text">
          <small className="text-muted">
            Created: {formatDate(comment.created_at)}
          </small>
        </p>
      </div>
    </div>
  );
}

export default CommentCard;
