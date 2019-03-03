import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    };
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    axios
      .post('/api/users/register', newUser)
      .then(user => console.log(user))
      .catch(err => {
        this.setState({
          errors: {
            name: err.response.data.name,
            email: err.response.data.email,
            password: err.response.data.password,
            password2: err.response.data.password2
          }
        });
        console.log(err.errors);
      });
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="register mt-3">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your Developer Account</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.name
                    })}
                    name="name"
                    value={this.state.name}
                    placeholder="Name"
                    onChange={this.onChange}
                  />
                  {errors.name && (
                    <div className="is-feedback text-danger">{errors.name}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.email
                    })}
                    placeholder="Email"
                    value={this.state.email}
                    name="email"
                    onChange={this.onChange}
                  />
                  <small>
                    This website uses Gravatar. It's good to use an email with
                    display picture.
                  </small>
                  {errors.email && (
                    <div className="is-feedback text-danger">
                      {errors.email}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.password
                    })}
                    name="password"
                    value={this.state.password}
                    placeholder="Password"
                    onChange={this.onChange}
                  />
                  {errors.password && (
                    <div className="is-feedback text-danger">
                      {errors.password}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.password2
                    })}
                    name="password2"
                    value={this.state.password2}
                    placeholder="Confirm your password"
                    onChange={this.onChange}
                  />
                  {errors.password2 && (
                    <div className="is-feedback text-danger">
                      {errors.password2}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    className="btn btn-info btn-block mt-4"
                    name="submit"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Register;
