import $ from 'jquery';
//const { $ } = window;
var colon = $('<div>').attr('class', 'colon')[0].outerHTML;
var num = $('<div>').attr('class', 'num')
  .append(
    $('<div>').attr('class', 'upper'),
    $('<div>').attr('class', 'base upper'),
    $('<div>').attr('class', 'base lower'),
    $('<div>').attr('class', 'lower')
  )[0].outerHTML;
var clock = $('<div>').attr('id', 'clock')
  .append(
    $(num).attr('id', 'd100'),
    $(num).attr('id', 'd10'),
    $(num).attr('id', 'd0'),
    $(colon).text('天'),
    $(num).attr('id', 'h10'),
    $(num).attr('id', 'h0'),
    $(colon).text('小时'),
    $(num).attr('id', 'm10'),
    $(num).attr('id', 'm0'),
    $(colon).text('分'),
    $(num).attr('id', 's10'),
    $(num).attr('id', 's0'),
    $(colon).text('秒'),
  );
var wrap = $('<div>')
  .attr('id', 'wrap')
  .append(
    $('<div>')
      .attr('id', 'container')
      .append(
        $('<ul>')
          .attr('id', 'main')
          .append(
            $('<li>')
              .attr('id', 'current')
              .attr('class', 'text'),
            $('<li>')
              .attr('id', 'counter')
              .append(clock),
            $('<li>')
              .append(
                $('<ol>')
                  .attr('id', 'future')
                  .attr('class', 'text')
              )
          )
      )
  );
export default wrap;