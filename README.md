# jquery.bem
Предназначен для описания поведения DOM элемента в BEM терминологии c использованием синтаксиса ES6

## Состав пакета
Библиотека состоит из следующих компонентов:
* ```BEM.Block```      - абстрактный класс для описания поведения блока
* ```BEM.Element```      - абстрактный класс для описания поведения элемента
* ```BEM.Collection``` - базовый класс коллекций блоков
* ```BEM.Registry```   - объект-хранилище для определенных bem-js блоков  
* ```BEM.Config```     - экземпляр конфига

## Декларация блока
JS-реализация блока описывает поведение определённого класса элементов веб-интерфейса. В конкретных интерфейсах каждый 
блок может быть представлен несколькими экземплярами. Экземпляр блока реализует функциональность своего класса и имеет 
собственное, независимое состояние. Экземпляры одного блока объединяются в коллекции ```BEM.Collection``` этого блока 

В терминах парадигмы объектно-ориентированного программирования:
* ***блок*** — класс;
* ***экземпляр блока*** — экземпляр класса.

Поведение блока описывается в JavaScript-файле блока (myblock.js).
В соответствии с ООП, вся функциональность блока реализуется модульно в методах блока. 
Данный класс должен расширять абстрактный класс ```BEM.Block``` 

Методы блока подразделяются на:
* статические методы и свойства.
* методы и свойства экземпляра блока;

### Cтатические методы и свойства блока (класса)

#### blockName
Свойство должно содержать имя блока.
***Внимание!*** данное свойство должно быть обязательно переопределено.

#### live
Cвойство может содержать объект со списоком js-событий и их обработчиков, подписка на которые произойдет при 
инициализации блока. В качестве обработчика могут выступать:
* ***строка***   - будет вызван одноименный метод у экземпляра блока
* ***callback*** - будет вызван переданный callback

``` js
//...
static get live()
{
	return {
		'click': 'onClick',
	}
}
```

#### events
Свойство может содержать объект со списком событий и их обработчиков. Структура возвращаемого объекта должна быть сделующей:
``` js
//...
static get events()
{
	return {
		// список обработчиков при изменении модификаторов блока
		'onMod': {
			// данный callback будет вызван каждый раз когда будет изменен модификатор modName не зависимо от его значения
			'modName': 'onModName',
			
			// если необходима подписка на изменения модификатора с определенным значением
		    'modName2': {
				'value1': 'onModNameValueOne',
				'value2': 'onModNameValueTwo',
		    }
		},
		
		// список обработчиков при изменении модификаторов у эл-ов блока
		'onElemMod': {
			// Ключ - имя эл-та. Значение - структура аналогичная onMod 
			'elemName': {
				'modName': 'onModName'
			}
		}
	}
}
```

#### mods
Свойство может содержать авто-модификаторы перечисление через пробел
Возможные значения
* ***hover***
* ***focus***
* ***press***

При наступлении соответсвующих событий у блока будут автом. изменяться указанные модификаторы

#### attrs
Свойство может содержать список аттрибутов которые будут установлены при инициализации блока.
``` js
//...
static get events()
{
	return {
		'attrName': 'attrValue',
	}
}
```

#### forced
Принудительная инициализация всех экземпляров блока на странице.
По умолчанию инициализация экземпляра блока происходит при наступлении внутри него какого либо пользовательского события
(навели мышку, кликнули и т.п). По умолчанию ***false***

#### lazy
Ленивая инициализация.
Св-во может содержать кол-во милисекунд на которое будет отложена инициализация блока.
Например при значении св-ва ***1000*** вместе со свойством ```forced``` в значении ***true*** инициализация блока 
произойдет через секунду после загрузки страницы. По умолчанию ***0***

#### cache
Кешировать все выборки.
Если св-во содержит ```true```, то при доступе к дочерним эл-ам все выборки будут сохранены в кеше.

#### $win, $doc, $body
Содержат ссылку на jQuery объект window, document, document.body соответственно 

#### create([tagName = 'div'])
Создает новый DOM элемент и возвращает экземпляр блока для этого эл-та

#### getInstance(DomElement node)
Возвращает экземпляр блока

#### makeCollection()
Создает новую коллекцию блоков данного типа. 
Для переопределения базовой коллекции блока нужно переопределить данный метод и в нем вернуть экземпляр своей коллекции коллекции

#### getCollection()
Метод возвращает коллекцию экземпляров блока на странице. 
Данная коллекция будет изменяться по мере инициализации новых блоков или их удалении

#### config()
Возвращает BEM.Config

#### register()
Метод регистрирует данный блок в реестре блоков. 
Должен быть обязательно вызван после определения класса.
``` js

// ...
class MyBlock extends BEM.Block
{
	// ...
}

MyBlock.register();
```

### Свойства экземпляра блока (класса)
* ***self*** - ссылка на класс, для доступа к статическим методам и свойствам (аналог ```static``` в php)
* ***parent*** - возвращает ссылку на родительский экземпляр блока.
* ***name*** - название блока/элемента
* ***$el*** - ссылка на jQuery объект блока/элемента
* ***el*** - ссылка на DomElement объект блока/элемента
* ***id*** - уникальный id экземпляра блока
* ***isBlock***
* ***isElement***

### Методы экземпляра блока (класса)

#### constructor(node, parms)
Конструктор класса. На вход принимает 2 параметра
* ***node***  - DomElement блока/элемента
* ***parms.cache*** - кэшировать выборки или нет
* ***parms.lazy***  - ленивая инициализация
* ***parms.role***  - ...

Параметр parms может быть указан в аттрибуте onclick ноды.

#### destroy([absolute = true])
Метод удаляет экземпляр блока. Если переданный параметр имеет значение ***true***, то вместе с удалением js объекта 
будет удален и html элемент ассоциированный с ним. По умолчанию ***true***
 
#### onInit()
Метод вызывается при инициализации экземпляра блока

#### addMod(name[, state])
Добавляет модификатор ***name*** со значением ***state***

#### delMod(name[, state])
Удаляет модификатор ***name*** со значением ***state***

#### toggleMod(name[, state])
Добавляет/удаляет модификатор ***name*** со значением ***state***

#### hasMod(name[, state])
Проверяет наличие модификатора ***name*** со значением ***state***

#### elem(name)
Возвращает первый ```BEM.Element``` js элемент блока по его имени из коллекции эл-ов

#### elems(name)
Возвращает коллекцию ```BEM.Collection``` js элементов блока

#### asBlock(blockName)
Если в верстке используются миксины bem-блоков, то с помощью этого метода можно получить эзлемпляр миксованного блока
``` html
<div id="mixin-block" class="b-block-1 b-block-2">
</div>
```

``` js
// ...
// переменная содержит экзепляр блока b-block-1
let block1 = MyBlock1.getInstance(node);

// переключились на другой блок миксина
let block2 = block1.asBlock('b-block-2');
```

#### $(selector[, force])
Возвращает jQuery объект выборки по селектору внутри блока. При переданом параметре ```force = true``` 
при поиске результата не будет использован кеш

#### $elems(name)
Возвращает jQuery объект коллекции элементов блоков

#### $elem(name)
Возвращает jQuery объект первый из коллекции элементов блоков

### Наследование блока
Одна и та же функциональность может быть востребована в нескольких блоках проекта. Например, разные блоки могут 
обращаться за данными к бэкенду, используя AJAX, или совершать однотипные операции с DOM-деревом и т.д. Чтобы избежать 
ненужных повторов в коде, общую функциональность можно инкапсулировать в виде модулей, а затем добавлять к блокам.

В этом случае создаваемый блок объявляется как наследник существующего. Для этого нужно, так же как и в php просто 
расширить класс существующего блока.
Для доступа к методам и свойствам родителького блока нужно использовать ключевое слово `super` (аналог parent в php)

``` js
import BEM from jquery.bem

class ParentBlock extends BEM.Block
{
	// ...
	foo()
	{
		// ...
	}
}

class MyBlock extends ParentBlock
{
	// ...
	foo()
	{
		// вызываем родительский метод
		super.foo.apply(this, arguments);
		
		// ...
	}
}
```

## Коллекции экземпляров блоков
При инициализации экземпляры блока одного типа помещаются коллекции ```BEM.Collection```

Получить коллекцию можно с помощью статического метода ```getCollection``` у блока.
``` js
import MyBlock from myblock;

let items = MyBlock.getCollection()
```

BEM.Collection реализует интерфейс ```Array```
в связи с чем для работы доступны все методы ```Array.prototype.*``` [ссылка](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array),

Так же для удобства использования есть методы позволяющие производить операции над всеми элементами сразу:
* ***addMod(name[, state])***
* ***delMod(name[, state])***
* ***toggleMod(name, state)***
* ***$el()***
* ***byMod(name[, state])*** - возвращает коллекцию с блоками отфильтрованными по модификатору
* ***invoke(fn, ...args)*** - вызывает метод ```fn``` с аргументами ***args*** у каждого экземпляра коллекции 
* ***invokeArray(fn, args)*** - аналогично методу ```invoke```, за исключением того, что аргументы передаются в виде массива 

### Переопределение коллекции
Для переопределения коллекции необходимо создать свой класс коллекций, который бы расширял базовый ```BEM.Collection```
``` js
// ...
class MyCollection extends BEM.Collection
{
	otherMethod()
	{
		// ...
	}
}
```

Далее у блока необходимо переопределить статический метод ```makeCollection``` в котором вернуть экземпляр своей коллекции
``` js
class MyBlock extends BEM.Block
{
	// ...
	static makeCollection()
	{
		return new MyCollection.make();
	}
}
```