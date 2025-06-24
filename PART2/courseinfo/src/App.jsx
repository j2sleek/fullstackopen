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

const Total = ({parts}) => {
  const t = 0;
  const total = parts.reduce(
    (a, b) => a + b.exercises, t
  );
  return (
    <h4>total of {total} exercises</h4>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]


  return <Course courses={courses} />
}

export default App