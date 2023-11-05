import React, { useEffect, useState } from 'react'

const SingleCommentContainer = ({comment}) => {
    return (
        <div>
            <p className='text-light'>{comment.commentText}</p>
        </div>
    )
}

export default SingleCommentContainer