import Image from "next/image"

export default function UserProfile({ user }) {
  return (
    <div className="box-center">
        <img src={user.photoURL} className="card-img-center img" alt="user-photo" />
        <p>
            <i>@{user.username}</i>
        </p>
        <h1>{user.displayName}</h1>
    </div>
  )
}
