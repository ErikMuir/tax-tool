# tax-tool

A command-line tool for tracking income and expenses for 1099 employees to simplify tax filing.

## Roadmap

### Scaffolding

#### Command-Line Parsing

- Establish patterns for parsing commands, arguments, and options
- Construct help text (unless it comes for free from a library)

#### Persistence

- Establish patterns for data persistence (json files?)
- Create a repository layer for interacting with data in a consistent manner

#### Custom Logger

- Create a custom logger that acts as a wrapper around the following `console` methods (`trace`, `log`, `info`, `warn`, `error`)
- Support the fluent syntax for method chaining
- Add support for colors
- Add support for menus

### Income

#### Income Categories

- Support the user being able to add income categories
- Support the user being able to update income categories
- Support the user being able to remove income categories

#### Income Entry

- Support the user being able to add income line items
- Support the user being able to update income line items
- Support the user being able to remove income line items

### Expense

#### Expense Categories

- Support the user being able to add expense categories
- Support the user being able to update expense categories
- Support the user being able to remove expense categories

#### Expense Entry

- Support the user being able to add expense line items
- Support the user being able to update expense line items
- Support the user being able to remove expense line items

### Reports

#### Report Configuration

- Support the user being able to set a desired tax rate
- Support the user being able to set a desired retirement percentage/amount

#### Report Running

- Support the user being able to run a report for a given year
- Support the user being able to run a report for a given quarter (and year)

#### Exports
- Support the user being able to export any of the reports (as .xlsx?)
