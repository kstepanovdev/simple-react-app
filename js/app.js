console.log(React);
console.log(ReactDOM);
window.eventEmitter = new EventEmitter();

var	my_news	=	[
  {
    author:	'Саша	Печкин',
    text:	'В	четчерг,	четвертого	числа...',
    bigText:	'в	четыре	с	четвертью	часа	четыре	чёрненьких	чумазеньких	чертёнка	чертили чёрными	чернилами	чертёж.'
  },
  {
    author:	'Просто	Вася',
    text:	'Считаю,	что	$	должен	стоить	35	рублей!',
    bigText:	'А	евро	42!'
  },
  {
    author:	'Гость',
    text:	'Бесплатно.	Скачать.	Лучший	сайт	-	http://localhost:3000',
    bigText:	'На	самом	деле	платно,	просто	нужно	прочитать	очень	длинное	лицензионное соглашение'
  }
];

var my_news1 = [];

const numbers = [1,2,3,5];

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      news: my_news
    };
  }
  
  componentDidMount(){
    var self = this;
    window.eventEmitter.addListener('News.add', function(item){
      var nextNews = item.concat(self.state.news);
      self.setState({ news: nextNews })
    })
  }
  
  componentWillUnmount(){
    window.eventEmitter.removeListener('News.add');
  }

  render(){
    return(
     <div	className="app">
        <Add />
        <h3> News </h3>
        <News last_news = { this.state.news } />  
      </div>
    );
  }
}

class News extends React.Component {

  render(){
    var newsTemplate;
    var last_news = this.props.last_news;

    if (last_news.length > 0) {
      newsTemplate = last_news.map((item, index) =>	
        <div key={index}>
          <Article data={item} /> 
        </div>	
      );
    }
    
    else { 
      return (
        newsTemplate =
        <div>
          <strong>
            Новостей нет
          </strong>
        </div>
      );
    }
  
    return (  
      <div className = "news">
        {newsTemplate}
        <strong 
          onClick={this.autoIncrementClick}
          className = { last_news.length > 0 ? '' : 'none' } > Всего новостей: {last_news.length} 
        </strong> 
      </div>  
    );  
  }
}

class Article extends React.Component {
  constructor(props){
    super(props);
    this.state = { visible: false };
    this.readMoreClick = this.readMoreClick.bind(this); 
  }

  readMoreClick() { 
    this.setState({
      visible: true 
    });
  }

  render(){
    var author = this.props.data.author; 
    var text = this.props.data.text;
    var bigText = this.props.data.bigText;
    var visible = this.state.visible; 
  
    return(
      <div className = "article">
        <p className = "news_author">{ author }:</p>
        <p className = "news_text">{ text }</p>
        <a href="#"
          onClick={this.readMoreClick} 
          className = { 'news_readmore '	+	(visible	?	'none':	'') }>
          Подробнее 
        </a>
        <p	
          className = { 'news_big-text ' +	(visible ? '' : 'none') }> { bigText } 
        </p> 
      </div> 
    );
  }
}

class Add extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      text: '',
      authorIsEmpty: true,
      textIsEmpty: true,
      agreeNotChecked: true
    } 
    this.btnClickHandler = this.btnClickHandler.bind(this)
    this.checkRuleClick = this.checkRuleClick.bind(this)
    this.fieldOnChange = this.fieldOnChange.bind(this)
  }

  componentDidMount(){
    ReactDOM.findDOMNode(this.refs.author).focus();
  }

  btnClickHandler(event){
    event.preventDefault();
    var author = ReactDOM.findDOMNode(this.refs.author).value;
    var textElement = ReactDOM.findDOMNode(this.refs.text);
    var text = textElement.value; 

    var item = [{
      author: author,
      text: text,
      bigText: '...'
    }];

    window.eventEmitter.emit('News.add', item);
    textElement.value = ''
    this.setState({ textIsEmpty: true })
  }

  fieldOnChange(fieldName, event){
    if (event.target.value.trim().length > 0) {
      this.setState({ [fieldName]: false })
    }
    else {
      this.setState({ [fieldName]: true })
    }
  }

  checkRuleClick(){
    this.setState({ agreeNotChecked: !this.state.agreeNotChecked }) 
  }

  render(){
    var agreeNotChecked = this.state.agreeNotChecked,
      authorIsEmpty = this.state.authorIsEmpty,
      textIsEmpty = this.state.textIsEmpty;
    return(
      <form  
        className='add-fresh-news'>
        <input
          onChange = {this.fieldOnChange.bind(this, 'authorIsEmpty')}
          type='text'
          className='add-author' 
          defaultValue=''
          placeholder='Ваше имя' 
          ref='author'
        />
        <textarea
          onChange = {this.fieldOnChange.bind(this, 'textIsEmpty')}
          className='add-text'
          defaultValue=''
          placeholder='Текст новости'
          ref='text'
        />
        <label className='add-checkrule'>
          <input
            defaultValue = { true }
            onChange = { this.checkRuleClick }
            name='Я согласен с правилами'
            type='checkbox'
            ref='agreed'
          />Я согласен с правилами
        </label>
        <button
          disabled = { authorIsEmpty || textIsEmpty || agreeNotChecked }
          className = 'add-btn'
          onClick = {this.btnClickHandler}
          ref = 'alert_btn'
        >
          Создать новость
        </button>
      </form>
    )  
  }
}

News.propTypes = {
  last_news:	React.PropTypes.array.isRequired 
} 

Article.propTypes = {
  data:	React.PropTypes.shape({
    author:	React.PropTypes.string.isRequired,
    text:	React.PropTypes.string.isRequired,
    bigText: React.PropTypes.string.isRequired
  }) 
}

ReactDOM.render(
		<App	/>, 
		document.getElementById('root')
);
