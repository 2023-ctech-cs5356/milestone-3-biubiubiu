/**
 * CS-5356-TODO
 * Create a new class
 *
 * A user should provide a `name` property
 * to use as the class name. When they submit
 * the form, send a POST /api/classes with
 * the `name` property in the request body.
 *
 * If it completes successfully, call `props.onClassCreated()`
 * to notify the parent component to refresh the view
 */
const CreateClass = props => {
  const handleSubmit = event => {
    event.preventDefault();
    console.log("[CS5356] On handle create class");

    fetch('/api/classes',{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({name: event.target.classname.value})
    }).then(response=>{
      if (response.ok){
        props.onClassCreated()
      }
    })

  };

  return (
    <>
      <div className="has-text-centered mb-5">
        <h1 className="title">Create a Class</h1>
      </div>
      <div
        style={{
          marginLeft: "25%",
          marginRight: "25%",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">
              Class Name
            </label>
            <div className="control">{/* Add an input for the name */}
            <input name="classname" className="input" />
            </div>
          </div>
          <div className="field has-text-centered">
            <div className="control">
            <input type = "submit" className="button is-primary" />
              {/* Add an input to submit the form */}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default CreateClass;
