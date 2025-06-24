const Header = ({name}) => <h1>{name}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map(part => (
      <Part name={part.name} exercises={part.exercises} key={part.id} />
    ))}
  </div>
)

const Part = ({name, exercises}) => (
  <p>
    {name} {exercises}
  </p>
)

const Total = ({parts}) => {
  const t = 0;
  const total = parts.reduce(
    (a, b) => a + b.exercises, t
  );
  return (
    <h4>total of {total} exercises</h4>
  )
}

const Course = ({courses}) => {
  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>
          <Header name={course.name} />
          <Content parts= {course.parts} />
          <Total parts={course.parts} />
        </div>
      ))}
    </div>
  )
}

export default Course;