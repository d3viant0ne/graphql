import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import mutation from '../mutations/Login';
import query from '../queries/CurrentUser';
import { hashHistory } from 'react-router';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: [],
    };
  }

  componentWillUpdate(nextProps) {
    if (!this.props.data.user && nextProps.data.user) {
      //redirect to dashboard
      hashHistory.push('/dashboard');
    }
  }

  onSubmit(event) {
    const { email, password } = this.state;
    event.preventDefault();
    this.onLogin({ email, password });
  }

  onLogin({ email, password }) {
    this.props
      .mutate({
        variables: { email, password },
        refetchQueries: [{ query }],
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(err => err.message);
        this.setState({ errors });
      });
    this.setState({ email: '', password: '', errors: [] });
  }

  render() {
    return (
      <div className="submit-form">
        <h2 className="submit-form__title">Login</h2>
        {this.state.errors.map(err => (
          <p className="submit-form__form--error" key={err}>
            {err}
          </p>
        ))}
        <form className="submit-form__form" onSubmit={this.onSubmit.bind(this)}>
          <input
            className="submit-form__form--input"
            type="text"
            value={this.state.email}
            placeholder="Email"
            onChange={e => this.setState({ email: e.target.value })}
          />

          <input
            className="submit-form__form--input"
            type="password"
            value={this.state.password}
            placeholder="Password"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <button className="submit-form__form--button">Submit</button>
        </form>
      </div>
    );
  }
}

export default graphql(query)(graphql(mutation)(LoginForm));
